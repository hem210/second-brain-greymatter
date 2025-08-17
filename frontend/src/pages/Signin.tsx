import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signin() {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            email: email,
            password: password
        });
        alert("You have signed in");
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
    }

    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl min-w-48 p-8">
            <Input ref={emailRef} placeholder="Email" />
            <Input ref={passwordRef} placeholder="Password" />
            <div className="flex justify-center pt-4">
                <Button onClick={signin} variant="primary" text="Signin" fullWidth={true} loading={false} />
            </div>
        </div>
    </div>
}