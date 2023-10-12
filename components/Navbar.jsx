"use client";

import { IconButton } from "@mui/material";
import { Person, Search, Menu } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

import "../styles/Navbar.scss";
import variables from "../styles/variables.module.scss"

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false)

  const { data: session } = useSession()
  const [providers, setProviders] = useState(null)

  // To sign-in using Google and next-auth
  useEffect(() => {
    const setUpProvider = async () => {
      const response = await getProviders()
      setProviders(response)
    }
    setUpProvider()
  }, [])

  return (
    <div className="navbar">
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>

      <div className="navbar_search">
        <input placeholder="Search..." />
        <IconButton>
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {session?.user ? <a href="/" className="host">Sell Your Work</a> : <a href="/" className="host">Sell Your Work</a> }

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!session?.user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={session?.user.image}
              alt="Profile"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link href="/">Log In</Link>
            <Link href="/">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link href="/">Wishlist</Link>
            <Link href="/">Cart</Link>
            <Link href="/">Your Shop</Link>
            <Link href="/">Sell Your Work</Link>

            <Link
              href="/"
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
