import json
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from flask_cors import CORS

# Step 1: Generate Dummy Data and Mappings
def generate_dummy_data():
    user_ids = [f'user_{i}' for i in range(1, 11)]
    product_ids = [f'prod_{i}' for i in range(1, 21)]

    user_id_map = {user_id: i for i, user_id in enumerate(user_ids)}
    prod_id_map = {prod_id: i for i, prod_id in enumerate(product_ids)}
    rev_prod_id_map = {i: prod_id for prod_id, i in prod_id_map.items()}

    with open('user_id_map.json', 'w') as f:
        json.dump(user_id_map, f, indent=4)

    with open('prod_id_map.json', 'w') as f:
        json.dump(prod_id_map, f, indent=4)

    with open('rev_prod_id_map.json', 'w') as f:
        json.dump(rev_prod_id_map, f, indent=4)

    ratings = []
    num_ratings = 100
    for _ in range(num_ratings):
        user_id = np.random.choice(user_ids)
        product_id = np.random.choice(product_ids)
        rating = np.random.randint(1, 6)
        ratings.append([user_id, product_id, rating])

    df = pd.DataFrame(ratings, columns=['user_id', 'prod_id', 'rating'])
    df.to_csv('dummy_ratings.csv', index=False)

    print("Dummy data and mappings created and saved.")

# Step 2: Create a Simple Model
def create_model():
    model = Sequential([
        Dense(10, input_dim=1, activation='relu'),
        Dense(10, activation='relu'),
        Dense(1, activation='linear')
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

# Generate dummy data and mappings
generate_dummy_data()

# Load or create a model (for demo purposes)
try:
    model = create_model()
    # Normally you would load a pre-trained model here
    model.save('recommender_model.h5')  # Save for demo purposes
except Exception as e:
    print(f"Error loading or creating model: {e}")
    model = None

# Load user and product mappings from JSON files
try:
    with open('user_id_map.json', 'r') as f:
        user_id_map = json.load(f)
    with open('prod_id_map.json', 'r') as f:
        prod_id_map = json.load(f)
    with open('rev_prod_id_map.json', 'r') as f:
        rev_prod_id_map = json.load(f)
except Exception as e:
    print(f"Error loading mappings: {e}")
    user_id_map = {}
    prod_id_map = {}
    rev_prod_id_map = {}

# Set up Flask
app = Flask(__name__)
CORS(app)

@app.route('/recommend', methods=['POST'])
def recommend():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.json
    user_id = data.get('user_id')

    if user_id in user_id_map:
        user_internal_id = user_id_map[user_id]
        user_vector = np.array([user_internal_id])
        product_ids = np.array(list(prod_id_map.values()))
        
        # Create dummy predictions for demonstration
        predictions = np.random.rand(len(product_ids))
        
        # Get the top 5 indices
        top_indices = np.argsort(predictions)[::-1][:5]
        
        # Log indices and mapping for debugging
        print("Top indices:", top_indices)
        print("rev_prod_id_map keys:", rev_prod_id_map.keys())
        
        # Ensure all indices are valid keys in rev_prod_id_map
        top_products = []
        for i in top_indices:
            if str(i) in rev_prod_id_map:
                top_products.append(rev_prod_id_map[str(i)])
            else:
                print(f"Index {i} not found in rev_prod_id_map")

        if not top_products:
            return jsonify({'error': 'No valid recommendations found'}), 500
        
        return jsonify({'recommended_products': top_products})
    else:
        return jsonify({'error': 'User ID not found'}), 400


if __name__ == '__main__':
    app.run(debug=True)
