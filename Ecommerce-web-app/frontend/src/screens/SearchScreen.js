import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import Product from "../components/Product";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";
import InfoBox from "../components/InfoBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "£1 to £50",
    value: "1-50",
  },
  {
    name: "£51 to £200",
    value: "51-200",
  },
  {
    name: "£201 to £1000",
    value: "201-1000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

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
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <>
      <div className="container-md mt-5 mb-4">
        <Helmet>
          <title>Shop | Tech&Technician</title>
        </Helmet>
        <Row>
          <Col
            md={3}
            className="border text-center text-md-start mb-3 bg-white p-3"
          >
            <h5>Category Filter</h5>
            <div className="mt-2">
              <ul
                style={{
                  listStyle: "none",
                }}
              >
                <li
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Link
                    className={
                      "all" === category
                        ? "text-bold"
                        : "text-dark text-decoration-none"
                    }
                    to={getFilterUrl({ category: "all" })}
                  >
                    <i className="bi bi-arrow-right"></i> Any
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      className={
                        c === category
                          ? "text-bold"
                          : "text-dark text-decoration-none"
                      }
                      to={getFilterUrl({ category: c })}
                    >
                      <i className="bi bi-arrow-right"></i> {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <h5>Price Filter</h5>
              <ul
                style={{
                  listStyle: "none",
                }}
              >
                <li
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <Link
                    className={
                      "all" === price
                        ? "text-bold"
                        : "text-dark text-decoration-none"
                    }
                    to={getFilterUrl({ price: "all" })}
                  >
                    <i className="bi bi-arrow-right"></i> Any
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      to={getFilterUrl({ price: p.value })}
                      className={
                        p.value === price
                          ? "text-bold"
                          : "text-dark text-decoration-none"
                      }
                    >
                      <i className="bi bi-arrow-right"></i> {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <h5>Avg. Customer Review</h5>
              <ul
                style={{
                  listStyle: "none",
                }}
              >
                {ratings.map((r) => (
                  <li
                    style={{
                      textDecoration: "none",
                    }}
                    key={r.name}
                  >
                    <Link
                      to={getFilterUrl({ rating: r.rating })}
                      className={
                        `${r.rating}` === `${rating}`
                          ? "text-dark text-decoration-none"
                          : "text-dark text-decoration-none"
                      }
                    >
                      <Rating caption={" & up"} rating={r.rating}></Rating>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={getFilterUrl({ rating: "all" })}
                    className={
                      rating === "all"
                        ? "text-dark text-decoration-none"
                        : "text-dark text-decoration-none"
                    }
                  >
                    <Rating caption={" & up"} rating={0}></Rating>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col md={9}>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <>
                <Row className="justify-content-between mb-3">
                  <Col>
                    <div>
                      {countProducts === 0 ? "No" : countProducts} Results
                      {query !== "all" && " : " + query}
                      {category !== "all" && " : " + category}
                      {price !== "all" && " : Price " + price}
                      {rating !== "all" && " : Rating " + rating + " & up"}
                      {query !== "all" ||
                      category !== "all" ||
                      rating !== "all" ||
                      price !== "all" ? (
                        <Button
                          size="sm"
                          variant="light"
                          onClick={() => navigate("/search")}
                        >
                          <i className="fas fa-times-circle"></i>
                        </Button>
                      ) : null}
                    </div>
                  </Col>
                  <Col className="text-end">
                    <select
                      value={order}
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price: High to Low</option>
                      <option value="toprated">Avg. Customer Reviews</option>
                    </select>
                  </Col>
                </Row>
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}

                <div className="d-flex flex-wrap justify-content-center">
                  {products.map((product) => (
                    <div sm={6} lg={4} className="mb-3" key={product._id}>
                      <Product product={product}></Product>
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-center p-2">
                  <div>
                    {[...Array(pages).keys()].map((x) => (
                      <Link
                        key={x + 1}
                        className="mx-1"
                        to={{
                          pathname: "/search",
                          search: getFilterUrl({ page: x + 1 }, true),
                        }}
                      >
                        <Button
                          className={
                            Number(page) === x + 1
                              ? "btn btn-success btn-sm"
                              : "btn btn-secondary btn-sm"
                          }
                        >
                          {x + 1}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Col>
        </Row>
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
}
