import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    case "SHIP_REQUEST":
      return { ...state, loadingShipped: true };
    case "SHIP_SUCCESS":
      return { ...state, loadingShipped: false, successShipped: true };
    case "SHIP_FAIL":
      return { ...state, loadingShipped: false };
    case "SHIP_RESET":
      return {
        ...state,
        loadingShipped: false,
        successShipped: false,
      };
    case "CANCEL_REQUEST":
      return { ...state, loadingCancelled: true };
    case "CANCEL_SUCCESS":
      return { ...state, loadingCancelled: false, successCancelled: true };
    case "CANCEL_FAIL":
      return { ...state, loadingCancelled: false };
    case "CANCEL_RESET":
      return {
        ...state,
        loadingCancelled: false,
        successCancelled: false,
      };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingShipped,
      loadingCancelled,
      loadingDeliver,
      successCancelled,
      successShipped,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder({data}, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate("/login");
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      successShipped ||
      successCancelled ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successShipped) {
        dispatch({ type: "SHIP_RESET" });
      }
      if (successCancelled) {
        dispatch({ type: "CANCEL_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "GBP",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    successShipped,
    successCancelled,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }
  async function shippedOrderHandler() {
    try {
      dispatch({ type: "SHIP_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/shipped`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "SHIP_SUCCESS", payload: data });
      toast.success("Order is Shipped");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "SHIP_FAIL" });
    }
  }
  async function cancelOrderHandler() {
    try {
      dispatch({ type: "CANCEL_REQUEST" });
      const { data } = await axios.put(
        `/api/orders/${order._id}/cancel`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CANCEL_SUCCESS", payload: data });
      toast.success("Order Cancelled");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CANCEL_FAIL" });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container-fluid mt-3">
      <Helmet>
        <title>Order {orderId} | Tech&Technician</title>
      </Helmet>
      <h3 className="my-3 text-break">Order #{orderId}</h3>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Phone:</strong> {order.shippingAddress.phone} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
                &nbsp;
                {order.shippingAddress.location &&
                  order.shippingAddress.location.lat && (
                    <a
                      target="_new"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </a>
                  )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : order.isShipped ? (
                <MessageBox variant="warning">
                  Order Has been Shipped
                </MessageBox>
              ) : order.isCancelled ? (
                <MessageBox variant="danger">
                  Order Has been Cancelled
                </MessageBox>
              ) : (
                <MessageBox variant="info">Order is Pending ...</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <ListGroup variant="flush">
                <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center mb-4">
                  <h6 style={{ fontWeight: "bolder" }}>ITEMS</h6>
                  <h6 style={{ fontWeight: "bolder" }}>QTY</h6>
                  <h6 style={{ fontWeight: "bolder" }}>PRICE</h6>
                </div>
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                      <div className="d-flex flex-column">
                        <Link to={`/product/${item.slug}`}>
                          <img
                            style={{ width: "60px", height: "60px" }}
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>
                        </Link>
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "blue",
                            width: "120px",
                          }}
                          className="text-break text_dots"
                          to={`/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div>
                        <span>{item.quantity}</span>
                      </div>
                      <div>£{item.price}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>£{order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>£{order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>£{order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>£{order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered &&
                  !order.isCancelled && (
                    <Button
                      variant="success"
                      type="button"
                      size="sm"
                      disabled={
                        loadingDeliver && loadingCancelled && loadingShipped
                      }
                      onClick={deliverOrderHandler}
                    >
                      Mark as Deliver
                    </Button>
                  )}
                <br />
                {userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered &&
                  !order.isShipped &&
                  !order.isCancelled && (
                    <Button
                      variant="warning"
                      type="button"
                      disabled={
                        loadingDeliver && loadingCancelled && loadingShipped
                      }
                      size="sm"
                      onClick={shippedOrderHandler}
                    >
                      Mark as Shipped
                    </Button>
                  )}
                <br />
                {userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered &&
                  !order.isShipped &&
                  !order.isCancelled && (
                    <Button
                      variant="danger"
                      type="button"
                      disabled={
                        loadingDeliver && loadingCancelled && loadingShipped
                      }
                      size="sm"
                      onClick={cancelOrderHandler}
                    >
                      Mark as Cancelled
                    </Button>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
