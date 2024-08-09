import { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  let totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <div className="container-fluid">
      <Helmet>
        <title>Shopping Cart | Tech&Technician</title>
      </Helmet>
      <Row className="mt-5 mb-5">
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              <Row className="mb-2">
                <Col className="d-flex justify-content-between align-items-center">
                  <h5>Items</h5>
                  <h5>Quantity</h5>
                  <h5 className="d-none d-sm-block">Subtotal</h5>
                  <h5>Remove</h5>
                </Col>
              </Row>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex flex-column">
                      <Link
                        style={{ textDecoration: "none", color: "blue" }}
                        to={`/product/${item.slug}`}
                      >
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
                      <Button
                        size="sm"
                        style={{ fontSize: "10px" }}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="danger"
                        disabled={item.quantity === 1}
                      >
                        <i className="bi bi-dash"></i>
                      </Button>
                      &nbsp;
                      <span>{item.quantity}</span>&nbsp;
                      <Button
                        size="sm"
                        style={{ fontSize: "10px" }}
                        variant="success"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </div>
                    <div className="d-none d-sm-block">£ {item.price}</div>
                    <div>
                      <Button
                        size="sm"
                        onClick={() => removeItemHandler(item)}
                        variant="danger"
                      >
                        <i className="bi bi-trash3"></i>
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <br />
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Total ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : £{totalPrice.toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
