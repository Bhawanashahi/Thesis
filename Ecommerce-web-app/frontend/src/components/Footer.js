import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="container-fluid">
      <div className="row bg-white p-3">
        <div className="col-12 col-md-4">
          <div>
            <h3>How can we help?</h3>
          </div>
          <div className="mt-3 text-break">
            <h6>
              Email: &nbsp;
              <a
                className="text-dark"
                href="mailto:info@techandtechnician.co.uk"
              >
                info@techandtechnician.co.uk
              </a>
            </h6>
          </div>
          <div className="mt-3">
            <h6>Tech&Technician UK Store</h6>
          </div>
          <div className="mt-3">
            <h6>Tel: 01642 432 036 (Only for Sale Enquiries)</h6>
          </div>
        </div>
        <div className="col-12 col-md-8 mt-2">
          <div className="row">
            <div className="col-6 mb-3 mb-md-0">
              <ul className="footer-link-ul">
                <h5 className="mb-md-3">Quick Links</h5>
                <li>
                  <Link to="/">
                    <i className="bi bi-arrow-right"></i> Home
                  </Link>
                </li>
                <li>
                  <Link to="/search">
                    <i className="bi bi-arrow-right"></i> Products
                  </Link>
                </li>
                <li>
                  <Link to="/signin">
                    <i className="bi bi-arrow-right"></i> Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup">
                    <i className="bi bi-arrow-right"></i> Signup
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-6 mb-3 mb-md-0">
              <ul className="footer-link-ul">
                <h5 className="mb-md-3">Customer Support</h5>
                <li>
                  <Link to="/about">
                    <i className="bi bi-arrow-right"></i> About
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <i className="bi bi-arrow-right"></i> Contact
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <i className="bi bi-arrow-right"></i> Report an issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex container-fluid mt-3 justify-content-between flex-wrap flex-sm-nowrap">
        <p>All Rights are reserved by TECH&TECHNICIAN UK © 2022</p>
        <p>
          Designed & Developed By :{" "}
          <a
            className="text-decoration-none "
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/aneebshahid27"
          >
            Muhammad Aneeb Shahid <i className="bi bi-linkedin"></i>
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
