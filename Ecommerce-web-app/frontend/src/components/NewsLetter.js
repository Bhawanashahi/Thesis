import React from "react";

const NewsLetter = () => {
  return (
    <div style={{ borderBottom: "1px solid" }} className="container">
      <div className="row mt-3 p-3 align-items-center">
        <div className="col-12 col-md-6">
          <h1 className="fw-bold">
            Be the First to Know About Deals and Special Offers
          </h1>
        </div>
        <div className="col-12 col-md-6">
          <input
            style={{
              border: "none",
              background: "transparent",
              borderBottom: "1px solid",
            }}
            type="text"
            placeholder="Enter your email here*"
          />{" "}
          &nbsp;
          <button className="btn btn-sm btn-primary mt-1">Subscribe Now</button>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
