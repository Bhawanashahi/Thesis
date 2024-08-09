import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 5) {
      toast.error("Password should be greater than 5 characters");
      return;
    }
    try {
      const { data } = await Axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="d-flex justify-content-center mt-5 mb-5">
      <Helmet>
        <title>Sign Up | Tech&Technician</title>
      </Helmet>
      <form className="login_form" onSubmit={submitHandler}>
        <p className="login_form-title">Create a new account</p>
        <div className="login_input-container">
          <input
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
            type="text"
          />
        </div>
        <div className="login_input-container">
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="login_input-container">
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className="login_input-container">
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        <button className="btn btn-primary w-100 rounded-0" type="submit">
          Sign up
        </button>
        <p className="signup-link">
          Already have an account?&nbsp;
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </p>
      </form>
    </div>
  );
}
