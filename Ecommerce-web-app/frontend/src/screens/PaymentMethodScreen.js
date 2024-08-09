import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../Store";

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="d-flex justify-content-center mt-5 mb-5">
        <Helmet>
          <title>Payment Method | Tech&Technician</title>
        </Helmet>
        <form className="login_form" onSubmit={submitHandler}>
          <p className="login_form-title">Payment Method</p>
          <div className="m-3">
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="m-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Credit/Debit Card"
              value="Credit/Debit Card"
              checked={paymentMethodName === "Credit/Debit Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-100 rounded-0" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
