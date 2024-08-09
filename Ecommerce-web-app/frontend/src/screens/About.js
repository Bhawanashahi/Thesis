import React from "react";
import NewsLetter from "./../components/NewsLetter";
import Footer from "./../components/Footer";
import InfoBox from "../components/InfoBox";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | Tech&Technician</title>
      </Helmet>
      <div className="container bg-white mt-5 mb-5 ">
        <div className="row first-row-about">
          <div className="col-12 col-md-12 text-break col-lg-6 p-3 d-flex justify-content-center align-items-center text-center first-row-col-about">
            <img
              className="about-logo-img"
              src="/images/logoAbout2.png"
              alt=""
            />
          </div>
          <div className="col-12 col-md-12 text-break col-lg-6 p-3 first-row-col2-about">
            <h2 className="text-center">About Us</h2>
            <p>
              "The best ideas are often the simplest and the most profitable."
              The Complete Gadgets Company Tech&Technicians UK, takes the buy
              and sell concept and updates it by trading in digital
              entertainment products. Tech&Technicians shops buy, sell and
              exchange mobile phones directly from the public. "What separates
              Tech&Technicians UK from wider buy and sell retailers is our
              execution." Tech&Technicians trade program in a focused, yet
              complementary product range. The brand is publicly acclaimed as a
              technology and entertainment specialist. We have developed a set
              of bespoke computer systems that simplify the process of buying
              and selling. Goods are tested before they are bought in and then
              resold with a 6-12 month warranty, offering customers great value
              for money and peace of mind. "Tech&Technicians UK has very little
              competition and we are able to set our own prices." There are
              opportunities for new franchise partners to roll out the
              Tech&Technicians retail brand in territories around the United
              Kingdom.
            </p>
          </div>
        </div>
        <div className="row mt-5 mb-3 text-center">
          <h3>What We Provide?</h3>
        </div>
        <div className="row text-break">
          <div className="col-lg-4 col-md-4 col-sm-12  p-3  text-center">
            <div className="h-100 about-content">
              <img className="mb-3" src="/images/about1.svg" alt="" />
              <h3>Best Prices & Offers</h3>
              <p className="text-center">
                Goods are tested before they are bought in and then resold with
                a 6-12 month warranty, offering customers great value for money
                and peace of mind. "Tech&Technicians UK has very little
                competition and we are able to set our own prices."
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3  text-center">
            <div className="h-100 about-content">
              <img className="mb-3" src="/images/about2.svg" alt="" />
              <h3>Best For Trust & Quality</h3>
              <p className="text-center">
                “Trust starts with truth and ends with truth.” What separates
                Tech&Technicians UK from wider buy and sell retailers is our
                execution. Tech&Technicians trade program in a focused, yet
                complementary product range. The brand is publicly acclaimed as
                a technology and entertainment specialist
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3  text-center">
            <div className="h-100 about-content">
              <img className="mb-3" src="/images/about3.svg" alt="" />
              <h3>Fast Delivery System</h3>
              <p className="text-center">
                All Devices are shipped after 24 hours of confirmation of
                payment. We do not ship out any items until payments have
                cleared. Tracking numbers will be provided for each item. If you
                purchase more than one item it will be packaged together and
                shipped under one tracking number.
              </p>
            </div>
          </div>
        </div>
        <div className="row text-break">
          <div className="col-lg-4 col-md-4 col-sm-12  p-3  text-center">
            <div className="h-100 about-content">
              <img className="mb-3" src="/images/about4.svg" alt="" />
              <h3>Easy Returns Service</h3>
              <p className="text-center">
                All used goods cover a 6 months warranty. All electronics new
                goods cover a 12 month warranty. The warranty on these covers
                any manufacturer faults and does NOT cover any physical damage
                or accidental damage. On our used items we DO NOT offer refunds
                however will offer an exchange or credit note depending on the
                date of purchase.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3  text-center">
            <div className="h-100 about-content">
              <img className="mb-3" src="/images/about5.svg" alt="" />
              <h3>100% satisfication</h3>
              <p className="text-center">
                If a product is returned as faulty it has to be fully tested by
                us before replacement can be offered, testing time starts upon
                returning the device and can take up to 1-3 working days. If a
                fault cannot be reproduced then no exchange will be authorised
                and the device will be returned to you immediately. Any products
                exchange must be returned in the original condition with all
                accessories.
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12 p-3  text-center">
            <div className="h-100 about-content">
              <img className="mb-3" src="/images/about6.svg" alt="" />
              <h3>Delivery Delay</h3>
              <p className="text-center">
                Please note that during National holidays such as Christmas, New
                Years eve and bank holidays, these may have delivery delays
                which we are not responsible for. During Lockdown we will
                continue working and try our best to provide prompt shipping
                however this may cause delays as couriers may have internal
                delays for deliveries.
              </p>
            </div>
          </div>
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

export default About;
