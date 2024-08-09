import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/signin", {
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
        <title>Sign In | Tech&Technician</title>
      </Helmet>
      <form className="login_form" onSubmit={submitHandler}>
        <p className="login_form-title">Sign in to your account</p>
        <div className="login_input-container">
          <input
            placeholder="Enter your email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login_input-container">
          <input
            placeholder="Enter your password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100 rounded-0" type="submit">
          Sign in
        </button>
        <p className="signup-link">
          No account?&nbsp;
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </p>
        <p className="signup-link">
          Forget Password? <Link to={`/forget-password`}>Reset Password</Link>
        </p>
      </form>
    </div>
  );
}
