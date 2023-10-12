"use client";

import "../../styles/Login.scss";
import { useState } from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        /* Pass email & password input to body as in server: const { email, password } = req.body */
        body: JSON.stringify({ email, password }), // Convert the data object to a JSON string
      });

      /* Get data after fetching */
      const loggedIn = await response.json();
      /* reponse.json() = res.status(200).json({ token, user }) as in server*/

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/");
      }
    } catch (error) {
      console.log("Login failed", error.message);
    }
  };

  async function handleGoogleSignIn() {
    signIn("google", { callbackUrl:"http://localhost:3000" })
  }

  return (
    <div className="login">
      <img src="/assets/login.jpg" alt="login" className="login_decor" />
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
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
          <button type="submit">Log In</button>
        </form>
        <button type="button" onClick={handleGoogleSignIn}>
          Log In with Google
        </button>
        <a href="/register">Don't have an account? Sign In Here</a>
        <p>DEMO Account</p>
        <p>Email - "phucmai@email.com" & Pass - "phucmai"</p>
      </div>
    </div>
  );
};

export default Login;
