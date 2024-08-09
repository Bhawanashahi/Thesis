import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Carousel from "../components/Carousel";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import InfoBox from "../components/InfoBox";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { useNavigate } from "react-router-dom";
import MobSearch from "../components/MobSearch";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const navigate = useNavigate();
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | Tech&Technician</title>
      </Helmet>
      <>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div className="container mt-3">
              <div className="d-none d-sm-block mb-5">
                <Carousel />
              </div>
              <div className="container mt-3 mb-4 d-md-none p-3">
                <MobSearch />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mx-md-3">New Arrivals</h2>
                <select
                  className="select_category_searchBox"
                  onChange={(e) => {
                    navigate(`/search?category=${e.target.value}`);
                  }}
                  name="category"
                  id="category"
                >
                  <option value="">Shop by Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-wrap justify-content-center mt-2 mb-4">
                {products.slice(-12).map((product) => (
                  <Product key={product.slug} product={product}></Product>
                ))}
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
        )}
      </>
    </>
  );
}
export default HomeScreen;
