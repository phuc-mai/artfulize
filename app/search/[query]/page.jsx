"use client";
import React, { useEffect, useState } from 'react'
import Loader from '@components/Loader';
import Navbar from '@components/Navbar';
import WorkList from '@components/List';

const SearchPage = ({ params }) => {

  const { query } = params;

  const [loading, setLoading] = useState(true);

  const [workList, setWorkList] = useState([])

  async function getWorkList() {
    try {
      const res = await fetch(`/api/work/search/${query}`, {
        method: "GET",
      });

      if (!res.ok) {
        console.log("Not found");
        return;
      }

      const data = await res.json();
      setWorkList(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getWorkList();
  }, [query]);

  return loading ? <Loader/> : (
    <>
      <Navbar />
      <WorkList data={workList} setWorkList={setWorkList} />
    </>
  )
}



export default SearchPage
