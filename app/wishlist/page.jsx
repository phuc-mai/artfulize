"use client";

import Navbar from "@components/Navbar";
import Loader from "@components/Loader";
import "../../styles/TitleList.scss";
import List from "@components/List";

import { useSession } from "next-auth/react";

const Wishlist = () => {
  const { data : session } = useSession();
  const wishlist = session?.user.wishlist;

  return !session ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <h1 className="title-list">Your Wishlist</h1>

      <List data={wishlist} />
    </>
  );
};

export default Wishlist;
