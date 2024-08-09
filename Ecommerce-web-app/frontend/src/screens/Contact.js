import React, { useState } from "react";
import { useRef } from "react";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import InfoBox from "../components/InfoBox";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const formRef = useRef(null);

  const handleEmail = (e) => {
    e.preventDefault();
    setFullName("");
    setEmail("");
    setSubject("");
    setMessage("");
    toast.success("Email sent Successfully");
  };

  return (
    <>
      <Helmet>
        <title>Contact | Tech&Technician</title>
      </Helmet>
      <div className="container mt-5 mb-4 contact-container-shadow">
        <div className="row">
          <div
            style={{ background: "aqua" }}
            className="col-12 col-md-4 col-lg-4 p-4"
          >
            <h2 className="text-center">Let's get in touch</h2>
            <p className="text-center">
              We're open for any suggestion or just to have a chat
            </p>
            <div className="row">
              <div className="col-2 ">
                <i
                  style={{ fontSize: "1.3rem", color: "red" }}
                  className="bi bi-geo-alt-fill"
                ></i>
              </div>
              <div className="col">
                <p>
                  Address: Unit 6, Regent Walk Shopping Centre, Redcar, TS10
                  3FB.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-2 ">
                <i
                  style={{ fontSize: "1.3rem", color: "green" }}
                  className="bi bi-telephone-fill"
                ></i>
              </div>
              <div className="col">
                <p>Phone: 01642 432 036</p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-2 ">
                <i
                  style={{ fontSize: "1.3rem", color: "darkblue" }}
                  className="bi bi-send-fill"
                ></i>
              </div>
              <div className="col text-break">
                <p>Email: info@techandtechnician.co.uk</p>
              </div>
            </div>
            <div className="row">
              <div className="col-2 ">
                <i
                  style={{ fontSize: "1.3rem", color: "purple" }}
                  className="bi bi-globe-americas"
                ></i>
              </div>
              <div className="col">
                <p>
                  Address: Unit 6, Regent Walk Shopping Centre, Redcar, TS10
                  3FB.
                </p>
              </div>
            </div>
          </div>
          <form
            ref={formRef}
            onSubmit={handleEmail}
            className="col-12 col-md-8 col-lg-8 p-4 bg-white"
          >
            <div className="row">
              <h2 className="text-center mb-3">Contact Us</h2>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Full Name"
                  name="user_name"
                  required
                />
              </div>
              <div
                id="email-input"
                className="col-12 col-sm-6 col-md-6 col-lg-6 "
              >
                <label
                  htmlFor="exampleFormControlInput2"
                  className="form-label"
                >
                  Email address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput2"
                  placeholder="name@example.com"
                  name="user_email"
                  required
                />
              </div>
              <div className="row my-2 mx-1">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Subject"
                  name="user_subject"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Enter your message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="7"
                  placeholder="Enter your message"
                  name="user_message"
                  required
                ></textarea>
                <button className="btn btn-info mt-3">
                  Send Now{" "}
                  <i
                    style={{ fontWeight: "bold" }}
                    className="bi bi-arrow-right mx-2"
                  ></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="container">
        <InfoBox />
      </div>
      <div className="container-fluid bg-white">
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Contact;
