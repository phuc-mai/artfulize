"use client";

import { IconButton } from "@mui/material";
import { Person, Search, Menu } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

import "../styles/Navbar.scss";
import variables from "../styles/variables.module.scss";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();

  const [query, setQuery] = useState("");

  const router = useRouter();

  const user = session?.user;

  const handleLogout = async () => {
    signOut({ callbackUrl: "/login" });
  };

  const searchWork = async () => {
    if(query.trim() == "") router.push(`/search/all`)
    else router.push(`/search/${query}`)
  };

  const [dropdownMenu, setDropdownMenu] = useState(false);

  return (
    <div className="navbar">
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>

      <div className="navbar_search">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchWork();
          }}
        >
          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IconButton>
            <Search
              sx={{ color: variables.pinkred }}
              onClick={() => searchWork()}
            />
          </IconButton>
        </form>
      </div>

      <div className="navbar_right">
        {user ? (
          <a href="/create-work" className="host">
            Sell Your Work
          </a>
        ) : (
          <a href="/login" className="host">
            Sell Your Work
          </a>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={user.profileImagePath}
              alt="Profile"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link href="/login">Log In</Link>
            <Link href="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link href="/">Wishlist</Link>
            <Link href="/">Cart</Link>
            <Link href={`/profile?id=${user._id}`}>Your Shop</Link>
            <Link href="/create-work">Sell Your Work</Link>
            <a onClick={handleLogout}>Log Out </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
