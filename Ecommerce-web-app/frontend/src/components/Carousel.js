import React from "react";
import { Link } from "react-router-dom";

const Carousel = () => {
  return (
    <>
      <div
        id="carouselExampleInterval"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="10000">
            <img src="/images/car3.jpg" className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item" data-bs-interval="2000">
            <img src="/images/car2.jpg" className="d-block w-100" alt="..." />
            <div className="carousel-content">
              <h3>
                <b>BOOK YOUR DEVICE FOR REPAIR</b>
              </h3>
              <p>
                <b>
                  Mobile Phones <br /> Tablets <br /> Laptops <br /> Consoles
                  <br /> We repair it all on SITE !!!
                </b>
              </p>
              <Link to="/contact">
                <button className="btn btn-primary btn-sm">Contact us now</button>
              </Link>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/images/car1.jpg" className="d-block w-100" alt="..." />
            <div className="carousel-content ">
              <h2>
                <b>GET THE LATEST GADJETS NOW</b>
              </h2>
              <p>
                <b>
                  BUY ONLINE <br /> OR CALL US <br /> TO COLLECT YOURS <br /> AT
                  OUR LOCAL STORE
                </b>
              </p>
              <Link to="/search">
                <button className="btn btn-primary btn-sm">BUY NOW</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel;
