"use client";

import Navbar from "@components/Navbar";
import Loader from "@components/Loader";
import List from "@components/List";
import "../../styles/TitleList.scss";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

const Profile = () => {
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const loggedInUserId = session?.user._id;

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  const [workList, setWorkList] = useState([]);
  const [profile, setProfile] = useState()

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(`api/users/${profileId}/work`);
      const data = await response.json();
      setProfile(data.profile)
      setWorkList(data.work);
      setLoading(false);
    };

    if (profileId) getWorkList();
  }, [profileId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      {loggedInUserId === profileId ? (
        <h1 className="title-list">Your Works</h1>
      ) : (
        <h1 className="title-list">{profile.username}'s Works</h1>
      )}

      <List data={workList} setWorkList={setWorkList} />
    </>
  );
};

export default Profile;
