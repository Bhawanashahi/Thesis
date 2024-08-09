import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo || !token) {
      navigate("/");
    }
  }, [navigate, userInfo, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await Axios.post("/api/users/reset-password", {
        password,
        token,
      });
      navigate("/signin");
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5 mb-5">
      <Helmet>
        <title>Reset Password | Tech&Technician</title>
      </Helmet>
      <form className="login_form" onSubmit={submitHandler}>
        <p className="login_form-title">Reset Password</p>
        <div className="login_input-container">
          <input
            placeholder="New Password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login_input-container">
          <input
            placeholder="Confirm New Password"
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100 rounded-0 mt-2" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}
