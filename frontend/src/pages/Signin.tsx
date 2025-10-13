import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signin() {
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Sign in to continue to your account
        </p>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input ref={emailRef} placeholder="Email" type="email" />
          <Input ref={passwordRef} placeholder="Password" type="password" />
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center mt-3">{error}</div>
        )}

        {/* Sign In Button */}
        <div className="pt-6">
          <Button
            onClick={signin}
            variant="primary"
            text="Sign In"
            fullWidth={true}
            loading={loading}
          />
        </div>

        {/* Redirect */}
        <div className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
