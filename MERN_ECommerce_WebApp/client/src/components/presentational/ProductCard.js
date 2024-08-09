import React from "react";
import "./ProductCards.css";
import PropTypes from "prop-types";
const ProductCard = props => {
  const { name, price } = props.product;

  return (
    <div>
      <div className="product-card container">
        <div>
          <p className="product-card label">{name}</p>
          <p className="product-card label">₹ {price}</p>
        </div>
      </div>
    </div>
  );
};
ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCard;
