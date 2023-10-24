"use client";
import React, { useEffect, useState } from 'react'
import Loader from '@components/Loader';
import Feed from '@components/Feed';
import Navbar from '@components/Navbar';

export default function SearchPage({params}) {

  const { query } = params;

  const [loading, setLoading] = useState(true);

  const [workList, setWorkList] = useState([])

  async function getWorkList() {
    try {
      const res = await fetch(`/api/work/search/${query}`, {
        method: "GET",
      });

      if (!res.ok) {
        console.log("not found");
        return;
      }
      const data = await res.json();
      console.log(data.workList)
      setWorkList(data.workList);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getWorkList();
  }, []);

  return loading ? <Loader/> : (
    <>
      <Navbar />
      <Feed searchWorkList={workList}/>
    </>
  )
}
