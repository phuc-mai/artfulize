"use client";

import Navbar from "@components/Navbar";
import Loader from "@components/Loader";
import WorkList from "@components/WorkList";
import "../../styles/Profile.scss";

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

  const handleDelete = async (work) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id.toString()}`, {
          method: "DELETE",
        });

        const filteredWork = workList.filter((item) => item._id !== work._id);

        setWorkList(filteredWork);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      {loggedInUserId === profileId ? (
        <h1 className="owner-list">Your Work List</h1>
      ) : (
        <h1 className="owner-list">{profile.username}'s Work List</h1>
      )}

      <WorkList data={workList} handleDelete={handleDelete} />
    </>
  );
};

export default Profile;
