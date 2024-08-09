import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Button from "react-bootstrap/esm/Button";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>My Orders | Tech&Technician</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="container mt-3 mb-3">
          <h3>My Orders</h3>
          <div className="table-responsive-md mt-2">
            <table className="table table-bordered bg-white">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL (£)</th>
                  <th>PAID/UNPAID</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? (
                        <span className="badge text-bg-success">
                          {order.paidAt.substring(0, 10)}{" "}
                          <i className="bi bi-check-circle"></i>
                        </span>
                      ) : (
                        <span className="badge text-bg-danger">
                          Not Paid Yet
                        </span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className="badge text-bg-success">
                          {order.deliveredAt.substring(0, 10)}{" "}
                          <i className="bi bi-check-circle"></i>
                        </span>
                      ) : order.isShipped ? (
                        <span className="badge text-bg-warning">Shipped</span>
                      ) : order.isCancelled ? (
                        <span className="badge text-bg-danger">Cancelled</span>
                      ) : (
                        <span className="badge text-bg-primary">Pending</span>
                      )}
                    </td>
                    <td>
                      <Button
                        type="button"
                        size="sm"
                        variant="success"
                        onClick={() => {
                          navigate(`/order/${order._id}`);
                        }}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
