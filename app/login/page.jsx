"use client";

import "../../styles/Login.scss";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (isGoogle = false) => {
    const response = await signIn(isGoogle ? "google" : "credentials", {
      redirect: false,
      email: email,
      password: password,
      callbackUrl: '/'
    });

    if (response.ok) {
      router.push("/");
    } else {
      console.error(response.error);
      setError("Wrong email or password. Please try again.");
    }
  };

  return (
    <div className="login">
      <img src="/assets/login.jpg" alt="login" className="login_decor" />
      <div className="login_content">
        <form
          className="login_content_form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(false);
          }}
        >
          <input
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />

          {/* Display the error message if it exists */}
          {error && <p className="error">{error}</p>}

          <button type="submit">Log In</button>
        </form>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          className="google"
        >
          <p>Log In with Google</p>
          <FcGoogle />
        </button>{" "}
        <a href="/register">Don't have an account? Sign In Here</a>
        <p>DEMO Account</p>
        <p>Email - "phucmai@email.com" & Pass - "phucmai"</p>
      </div>
    </div>
  );
};

export default Login;
