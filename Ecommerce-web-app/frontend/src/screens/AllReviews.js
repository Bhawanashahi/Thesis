import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { getError } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
const AllReviews = () => {
  const [{ loadingDelete, successDelete, error }, dispatch] = useReducer(
    reducer,
    {
      product: [],
      loading: true,
      error: "",
    }
  );

  const [productId, setProductId] = useState("");

  const [allReviews, setAllReviews] = useState([]);

  const productReviewsSubmitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const result = await axios.get(`/api/products/reviews/${productId}`);
      dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      setAllReviews(result.data.reviews);
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (productId === "" || productId.length !== 24) {
        return;
      }
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/reviews/${productId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        setAllReviews(result.data.reviews);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete, productId]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const deleteHandler = async (review) => {
    if (window.confirm("Are you sure to delete?")) {
      if (productId === "" || productId.length !== 24) {
        toast.error("Please check product Id");
        return;
      }
      try {
        await axios.delete(`/api/products/reviews/${review._id}/${productId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("review deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>Manage Reviews | Tech&Technician</title>
      </Helmet>
      <div className="d-flex justify-content-center mt-5 mb-5">
        <form className="login_form" onSubmit={productReviewsSubmitHandler}>
          <p className="login_form-title text-break">GET REVIEWS</p>
          <div className="login_input-container">
            <input
              type="text"
              placeholder="Enter product Id ..."
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-100 rounded-0" type="submit">
            Search
          </button>
        </form>
      </div>
      <h2>All Reviews</h2>
      {allReviews.length < 1 ? (
        <div className="table-responsive-md bg-white">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>COMMENT</th>
                <th>RATING</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider"></tbody>
          </table>
          <h4 className="text-center p-3">
            This product has no reviews or product id may be wrong
          </h4>
        </div>
      ) : (
        <div className="table-responsive-md bg-white">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>COMMENT</th>
                <th>RATING</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {allReviews.map((review) => (
                <tr key={review._id}>
                  <td>{review._id}</td>
                  <td>{review.name ? review.name : "DELETED USER"}</td>
                  <td>{review.comment}</td>
                  <td>{review.rating}</td>
                  <td>
                    <button
                      disabled={loadingDelete}
                      onClick={() => deleteHandler(review)}
                      className="btn btn-danger btn-sm"
                    >
                      {loadingDelete ? "Wait" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllReviews;
