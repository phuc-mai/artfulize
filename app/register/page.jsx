"use client";

import "../../styles/Register.scss";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form_data = new FormData();

      // key in [key, value] --> key = "name"
      for (var key in formData) {
        form_data.append(key, formData[key]);
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: form_data,
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.log("Registration failed", error.message);
    }
  };

  async function handleGoogleSignIn() {
    signIn("google", { callbackUrl:"/" })
  }

  return (
    <div className="register">
      <img
        src="/assets/register.jpg"
        alt="register"
        className="register_decor"
      />
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={formData.username}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}
          <input
            type="file"
            id="image"
            style={{ display: "none" }}
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile" />
            <p>Upload Profile Photo</p>
          </label>{" "}
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>
            Register
          </button>
        </form>
        <button type="button" onClick={() => handleGoogleSignIn()} className="google">
          <p>Log In with Google</p>
          <FcGoogle />
        </button>{" "}
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default Register;
