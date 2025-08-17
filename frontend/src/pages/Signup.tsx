import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const nameRef = useRef<HTMLInputElement>();
    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    async function signup() {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        await axios.post(BACKEND_URL + "/api/v1/signup", {
            name: name,
            email: email,
            password: password
        });
        alert("You have signed up");
        navigate("/signin");
    }

    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl min-w-48 p-8">
            <Input ref={nameRef} placeholder="Name" />
            <Input ref={emailRef} placeholder="Email" />
            <Input ref={passwordRef} placeholder="Password" />
        <div className="flex justify-center pt-4">
            <Button onClick={signup} variant="primary" text="Signup" fullWidth={true} loading={false} />
        </div>
        </div>
    </div>
}