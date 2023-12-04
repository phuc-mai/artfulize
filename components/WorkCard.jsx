"use client";

import "../styles/WorkCard.scss";
import variables from "../styles/variables.module.scss";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Favorite,
  FavoriteBorder,
  ArrowForwardIos,
  ArrowBackIosNew,
  Delete,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";

const WorkCard = ({ work }) => {
  const router = useRouter();

  /* SLIDER FOR IMAGES */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotosPaths.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotosPaths.length) %
        work.workPhotosPaths.length
    );
  };

  const { data: session, update } = useSession();
  const userId = session?.user?._id;

  /* ADD TO WISHLIST */
  const wishlist = session?.user?.wishlist;

  const isLiked = wishlist?.find((item) => item?._id === work._id);

  const patchWishlist = async () => {
    const response = await fetch(`/api/users/${userId}/wishlist/${work._id}`, {
      method: "PATCH",
    });

    const data = await response.json();
    update({ user: { wishlist: data.wishlist } });
  };

  /* DELETE WORK */
  const handleDelete = async () => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id.toString()}`, {
          method: "DELETE",
        });
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className="work-card"
      onClick={() => {
        router.push(`/work-details?id=${work._id}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {work.workPhotosPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img src={photo} alt={`photo ${index + 1}`} />
              <div
                className="prev-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevSlide(e);
                }}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextSlide(e);
                }}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info">
        <div>
          <h3>{work.title}</h3>
          <div className="creator">
            <img src={work.creator.profileImagePath} alt="creator" />
            <span>{work.creator.username}</span> in <span>{work.category}</span>
          </div>
        </div>
        <div className="price">$ {work.price}</div>
      </div>

      {userId === work?.creator._id ? (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Delete
            sx={{
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "5px",
              fontSize: "30px",
            }}
          />
        </div>
      ) : (
        <div
          className="icon"
          onClick={(e) => {
            e.stopPropagation();
            patchWishlist();
          }}
        >
          {isLiked ? (
            <Favorite
              sx={{
                color: variables.pinkred,
                borderRadius: "50%",
                backgroundColor: "white",
                padding: "5px",
                fontSize: "30px",
              }}
            />
          ) : (
            <FavoriteBorder
              sx={{
                borderRadius: "50%",
                backgroundColor: "white",
                padding: "5px",
                fontSize: "30px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WorkCard;
