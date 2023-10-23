"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import variables from "../../styles/variables.module.scss";
import { Favorite, FavoriteBorder, Edit } from "@mui/icons-material";

import "../../styles/WorkDetails.scss";
import Navbar from "@components/Navbar";
import Loader from "@components/Loader";

const WorkDetails = () => {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [loading, setLoading] = useState(true);

  const [work, setWork] = useState({});

  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`api/work/${workId}`);
      const work = await response.json();

      setWork(work);
      setLoading(false);
    };

    if (workId) getWorkDetails();
  }, [workId]);

  /* ADD TO WISHLIST */
  const userId = session?.user?._id;
  const wishlist = session?.user?.wishlist;
  
  const isLiked = wishlist?.find((item) => item?._id === workId);

  const patchWishlist = async () => {
    const response = await fetch(`/api/users/${userId}/wishlist/${workId}`, {
      method: "PATCH",
    });

    const data = await response.json();
    update({user: {wishlist: data.wishlist}});
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="work-details">
        <div className="title">
          <h1>{work.title}</h1>
          {work?.creator?._id === userId ? (
            <div className="save" onClick={() => {router.push(`/update-work?id=${work._id}`)}}>
              <Edit />
              <p>Edit</p>
            </div>
          ) : (
            <div className="save" onClick={patchWishlist}>
              {isLiked ? (
                <Favorite sx={{ color: variables.pinkred }} />
              ) : (
                <FavoriteBorder />
              )}
              <p>Save</p>
            </div>
          )}
        </div>

        <div className="photos">
          {work.workPhotosPaths?.map((photo, index) => (
            <img key={index} src={photo} alt="work demo" />
          ))}
        </div>
        <hr />
        <div className="profile" onClick={() => {router.push(`/profile?id=${work.creator._id}`)}}>
          <img src={work.creator.profileImagePath} alt="profile" />
          <h3>Created by {work.creator.username}</h3>
        </div>
        <hr />
        <h3>About this product</h3>
        <p>{work.description}</p>
        <button type="submit">ADD TO CART</button>
      </div>
    </>
  );
};

export default WorkDetails;
