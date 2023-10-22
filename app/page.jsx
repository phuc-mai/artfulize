"use client"

import Navbar from "@components/Navbar";
import Categories from "@components/Categories";

import { useState, useEffect } from "react";
import WorkList from "@components/WorkList";

const Home = () => {
  const [workList, setWorkList] = useState([])

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch("api/work")
      const data = await response.json()
      console.log(data)
      setWorkList(data)
    }

    getWorkList()
  }, [])

  return (
    <>
      <Navbar />
      <Categories />
      <WorkList data={workList}/>
    </>
  );
};

export default Home;
