import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

export default function ForgetPasswordScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await Axios.post("/api/users/forget-password", {
        email,
      });
      toast.success(data.message);
      setLoading(false);
      setEmail("");
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5 mb-5">
      <Helmet>
        <title>Forget Password | Tech&Technician</title>
      </Helmet>
      <form className="login_form" onSubmit={submitHandler}>
        <p className="login_form-title">Forgot Password ?</p>
        <div className="login_input-container">
          <input
            placeholder="Enter your email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          disabled={loading}
          className="btn btn-primary w-100 rounded-0"
          type="submit"
        >
          {loading ? "Processing your request..." : "Continue"}
        </button>
        <p className="signup-link">
          No account?&nbsp;
          <Link to="/signup">Create your account</Link>
        </p>
      </form>
    </div>
  );
}
