"use client"

import Navbar from "@components/Navbar";
import Feed from "@components/Feed";
import Slide from "@components/Slide";
import Footer from "@components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      {/* <Slide /> */}
      <Feed />
      <Footer />
    </>
  );
};

export default Home;
