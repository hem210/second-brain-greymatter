import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signup() {
    const name = nameRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(BACKEND_URL + "/api/v1/signup", {
        name,
        email,
        password,
      });
      alert("Account created successfully!");
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setError("Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create an Account
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Sign up to start your journey
        </p>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input ref={nameRef} placeholder="Full Name" type="text" />
          <Input ref={emailRef} placeholder="Email" type="email" />
          <Input ref={passwordRef} placeholder="Password" type="password" />
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center mt-3">{error}</div>
        )}

        {/* Sign Up Button */}
        <div className="pt-6">
          <Button
            onClick={signup}
            variant="primary"
            text="Sign Up"
            fullWidth={true}
            loading={loading}
          />
        </div>

        {/* Redirect */}
        <div className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
