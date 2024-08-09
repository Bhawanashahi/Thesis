import React, { useContext } from "react";
import SearchBox from "./SearchBox";
import { Link, NavLink } from "react-router-dom";
import { Store } from "../Store";
import { ShoppingBag } from "lucide-react";

const Navbar = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  return (
    <>
      <div className="nav_bg">
        <div className="d-flex justify-content-between align-items-center p-3 mx-2">
          <div className="nav_logo">
            <i
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasWithBothOptions"
              aria-controls="offcanvasWithBothOptions"
              style={{
                fontSize: "29px",
                cursor: "pointer",
                marginRight: "10px",
              }}
              className="bi bi-list d-sm-none"
            ></i>
            <a href="/">
              <img src="/images/navlogo.png" alt="nav_logo" />
            </a>
          </div>
          <div
            style={{ position: "relative", marginRight: "12px" }}
            className="nav_cart"
          >
            <Link className="text-dark text-decoration-none" to="/cart">
              <ShoppingBag />
            </Link>
            {cart.cartItems.length > 0 ? (
              <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                {cart.cartItems.length}
              </span>
            ) : (
              <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                0
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="nav_pages bg-white d-none d-sm-flex justify-content-between align-items-center">
        <ul
          style={{ listStyleType: "none" }}
          className="d-flex align-items-center mx-2 "
        >
          <NavLink className="text-dark text-decoration-none" to="/">
            <li>Home</li>
          </NavLink>
          <NavLink className="text-dark text-decoration-none" to="/search">
            <li>Shop</li>
          </NavLink>
          <NavLink className="text-dark text-decoration-none" to="/about">
            <li>About</li>
          </NavLink>
          <NavLink className="text-dark text-decoration-none" to="/contact">
            <li>Contact</li>
          </NavLink>
          {userInfo ? (
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle "
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userInfo.name}
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/orderhistory">
                    My Order History
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" onClick={signoutHandler}>
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          ) : (
            <>
              <li>
                <Link to="/signin">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
          {userInfo && userInfo.isAdmin && (
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle "
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Admin
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/admin/dashboard">
                    View Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/admin/products">
                    Manage Products
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/admin/orders">
                    Manage Orders
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/admin/users">
                    Manage Users
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/admin/allreviews">
                    Manage Reviews
                  </Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
        <div className="d-none d-md-block nav_search_box mx-2">
          <SearchBox />
        </div>
      </div>
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            <img style={{ width: "96px" }} src="/images/navLogo.png" alt="" />
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="offCanvas_ul">
            <li data-bs-dismiss="offcanvas">
              <Link to="/">Home</Link>
            </li>
            <li data-bs-dismiss="offcanvas">
              <Link to="/search">Shop</Link>
            </li>
            <li data-bs-dismiss="offcanvas">
              <Link to="/about">About</Link>
            </li>
            <li data-bs-dismiss="offcanvas">
              <Link to="/contact">Contact</Link>
            </li>
            {userInfo ? (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle "
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userInfo.name}
                </Link>
                <ul className="dropdown-menu">
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" to="/profile">
                      My Profile
                    </Link>
                  </li>
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" to="/orderhistory">
                      My Order History
                    </Link>
                  </li>
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" onClick={signoutHandler}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li data-bs-dismiss="offcanvas">
                  <Link to="/signin">Login</Link>
                </li>
                <li data-bs-dismiss="offcanvas">
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
            {userInfo && userInfo.isAdmin && (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle "
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin
                </Link>
                <ul className="dropdown-menu">
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" to="/admin/dashboard">
                      View Dashboard
                    </Link>
                  </li>
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" to="/admin/products">
                      Manage Products
                    </Link>
                  </li>
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" to="/admin/orders">
                      Manage Orders
                    </Link>
                  </li>
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" to="/admin/users">
                      Manage Users
                    </Link>
                  </li>
                  <li data-bs-dismiss="offcanvas">
                    <Link className="dropdown-item" to="/admin/allreviews">
                      Manage Reviews
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
