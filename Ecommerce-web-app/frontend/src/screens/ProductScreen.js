import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import InfoBox from "../components/InfoBox";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import Product from "../components/Product";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const buyNowHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Review submitted successfully");
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      setComment("");
      setRating("");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const [qty, setQty] = useState(1);
  const increaseQuantity = () => {
    if (product.countInStock <= qty) {
      return toast.error("Sorry. Product stock is limited");
    } else {
      const itemquantity = qty + 1;
      setQty(itemquantity);
    }
  };

  const decreaseQuantity = () => {
    if (1 >= qty) return;
    const itemquantity = qty - 1;
    setQty(itemquantity);
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => setProducts(products))
      .catch((err) => toast.error(err));
  };

  const relatedProducts = products.filter(
    (item) => item.category === product.category && item._id !== product._id
  );

  return (
    <>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Helmet>
            <title>{product?.slug} | Tech&Technician</title>
          </Helmet>
          <div className="row m-3 mt-5 mb-3">
            <div className="col-12 col-md-6 col-lg-6 ">
              <div className="details-main-image p-3">
                <img src={selectedImage || product.image} alt="" />
              </div>
              <div className="details-small-image m-3">
                {[product.image, ...product.images].map((x) => (
                  <img
                    onClick={() => setSelectedImage(x)}
                    key={x}
                    src={x}
                    alt="product"
                  />
                ))}
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-6 bg-white">
              <div className="single-product-details p-3">
                <div className="cat-name">
                  <p className="p-cat">Category: {product.category}</p>
                  <h4 className="text-primary">{product.name}</h4>
                </div>
                <div className="p-prices mt-3">
                  <span className="fs-4">Price :</span> &nbsp;
                  <span className="fs-4">£ {product.price}</span> &nbsp;
                </div>
                <div className="p-status-qty mt-3">
                  <span className="fs-5">Status :</span> &nbsp;
                  {product.countInStock > 0 ? (
                    <span className="badge fs-6 text-bg-success">InStock</span>
                  ) : (
                    <span className="badge fs-6 text-bg-danger">
                      OutOfStock
                    </span>
                  )}
                </div>
                {product.numReviews > 0 && (
                  <div className="mt-3">
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    ></Rating>
                  </div>
                )}
                <div className="single-cart-section mt-3">
                  {product.countInStock > 0 && (
                    <>
                      <h4>Select Quantity :</h4>
                      <div className="counter-grp input-group mb-3 ">
                        <button
                          onClick={decreaseQuantity}
                          type="button"
                          className="btn btn-sm btn-danger"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={qty}
                          readOnly
                          className="my-counter text-center"
                        />
                        <button
                          onClick={increaseQuantity}
                          type="button"
                          className="btn btn-sm btn-success"
                        >
                          +
                        </button>
                      </div>
                      {product.countInStock < 5 && (
                        <p className="text-danger">
                          Low Stock: Only {product.countInStock} Left
                        </p>
                      )}
                      <div>
                        <button
                          className="btn btn-primary btn-sm "
                          onClick={addToCartHandler}
                        >
                          Add to Cart
                        </button>
                        &nbsp;
                        <button
                          className="btn btn-success btn-sm"
                          onClick={buyNowHandler}
                        >
                          Buy Now
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-description mt-3">
                  <p className="fs-5 mb-0">Description :</p>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=" container mt-2 ">
            <div className="row ">
              <h4 className="text-center">Ratings</h4>
              <div className="col-md-4 d-flex justify-content-center align-items-center bg-white border">
                <div className="p-3 w-50 text-center ">
                  <span className="fs-2">{product.rating.toFixed(1)}</span> / 5
                  <p>
                    <Rating rating={product.rating}></Rating>
                  </p>
                  <p>{product.numReviews} Reviews</p>
                </div>
              </div>
              <div className="col-md-8 border bg-white">
                <div className="p-3">
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <h4 className="text-center">Submit a Review</h4>
                      <p className="text-center">
                        <select
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="w-100 p-2 mt-3"
                          required
                        >
                          <option>Choose Rating</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </select>
                      </p>
                      <textarea
                        className="w-100 p-3"
                        placeholder="Leave a comment here"
                        value={comment}
                        required
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <button
                        type="submit"
                        disabled={loadingCreateReview}
                        className="btn btn-primary btn-sm"
                      >
                        SUBMIT
                      </button>
                    </form>
                  ) : (
                    <div>
                      <h4 className="text-center mb-3">Submit a Review</h4>
                      <MessageBox variant="danger">
                        Please{" "}
                        <Link to={`/signin?redirect=/product/${product.slug}`}>
                          Sign In
                        </Link>{" "}
                        to write a review
                      </MessageBox>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-3 p-0">
            <h3>Product Reviews</h3>
            {product.reviews.length === 0 ? (
              <MessageBox variant="warning">
                There are no reviews yet
              </MessageBox>
            ) : (
              <div className="submitted_reviews">
                {product.reviews.map((review) => (
                  <div key={review._id} className="reviews-of-product p-3">
                    <div className="name-date-review d-flex justify-content-between align-items-center">
                      <div className="name-of-reviewer">
                        <h5>{review.name}</h5>
                      </div>
                      <div className="date-of-review">
                        <h6>
                          {new Date(review.createdAt)
                            .toString()
                            .substring(0, 25)}
                        </h6>
                      </div>
                    </div>
                    <div className="rating-comment-review">
                      <div className="rating-of-review">
                        <Rating rating={review.rating} caption=" "></Rating>
                      </div>
                      <div className="comment-review">
                        <p>{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {relatedProducts.length > 0 ? (
            <>
              <div className="container mt-5">
                <h2>Related Products</h2>
              </div>
              <div className="container d-flex flex-wrap justify-content-center p-2">
                {relatedProducts.slice(-6).map((related) => (
                  <Product key={related.slug} product={related}></Product>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
      <div className="container">
        <InfoBox />
      </div>
      <div className="container-fluid bg-white">
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
}
export default ProductScreen;
