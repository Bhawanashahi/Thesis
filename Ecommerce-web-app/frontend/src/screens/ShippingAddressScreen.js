import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    fullBox,
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [phone, setPhone] = useState(shippingAddress.phone || "");
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);
  const email = userInfo?.email;
  const country = "United Kingdom";
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        email,
        address,
        city,
        phone,
        postalCode,
        country,
        location: shippingAddress.location,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        email,
        address,
        city,
        phone,
        postalCode,
        country,
        location: shippingAddress.location,
      })
    );
    navigate("/payment");
  };

  useEffect(() => {
    ctxDispatch({ type: "SET_FULLBOX_OFF" });
  }, [ctxDispatch, fullBox]);

  return (
    <>
      <Helmet>
        <title>Shipping Address | Tech&Technician</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="d-flex justify-content-center mt-2 mb-5">
        <form className="login_form" onSubmit={submitHandler}>
          <p className="login_form-title">Shipping Address</p>
          <div className="login_input-container">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="login_input-container">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Complete Address"
            />
          </div>
          <div className="login_input-container">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Enter your City"
            />
          </div>
          <div className="login_input-container">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter your Phone"
            />
          </div>
          <div className="login_input-container">
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              placeholder="Postal Code"
            />
          </div>
          <div className="login_input-container">
            <input value={country} required placeholder="United Kingdom" />
          </div>
          <button className="btn btn-primary w-100 rounded-0" type="submit">
            Continue
          </button>
        </form>
      </div>
    </>
  );
}
