"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import variables from "../../styles/variables.module.scss";
import {
  Favorite,
  FavoriteBorder,
  Edit,
  ArrowForwardIos,
  ArrowBackIosNew,
  ShoppingCart,
} from "@mui/icons-material";

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

  /* SLIDER FOR PHOTOS */
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

  /* SHOW MORE PHOTOS */
  const [visiblePhotos, setVisiblePhotos] = useState(5);

  const loadMorePhotos = () => {
    setVisiblePhotos(visiblePhotos + 5);
  };

  /* SELECT PHOTOS TO SHOW */
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const handleSelectPhoto = (index) => {
    setSelectedPhoto(index);
    setCurrentIndex(index);
  };

  /* GET WORK DETAILS */
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
    update({ user: { wishlist: data.wishlist } });
  };

  /* ADD TO CART */
  const cart = session?.user?.cart;

  const isInCart = cart?.find((item) => item?.workId === workId);

  const addToCart = async () => {
    const newCartItem = {
      workId,
      image: work.workPhotosPaths[0],
      title: work.title,
      category: work.category,
      creator: work.creator,
      price: work.price,
      quantity: 1,
    };

    if (!isInCart) {
      const newCart = [...cart, newCartItem];

      try {
        await fetch(`/api/users/${userId}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: newCart }),
        });

        update({ user: { cart: newCart } });
      } catch (err) {
        console.error("Error adding to cart:", err.message);
      }
    } else {
      confirm("This item is already in Cart!");
      return
    }
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
            <div
              className="save"
              onClick={() => {
                router.push(`/update-work?id=${work._id}`);
              }}
            >
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

        <div className="photos">
          {work.workPhotosPaths?.slice(0, visiblePhotos).map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt="work demo"
              onClick={() => handleSelectPhoto(index)}
              className={selectedPhoto === index ? "selected" : ""}
            />
          ))}

          {visiblePhotos < work.workPhotosPaths.length && (
            <div className="show-more" onClick={loadMorePhotos}>
              <ArrowForwardIos sx={{ fontSize: "40px" }} />
              Show More
            </div>
          )}
        </div>
        <hr />
        <div
          className="profile"
          onClick={() => {
            router.push(`/shop?id=${work.creator._id}`);
          }}
        >
          <img src={work.creator.profileImagePath} alt="profile" />
          <h3>Created by {work.creator.username}</h3>
        </div>
        <hr />
        <h3>About this product</h3>
        <p>{work.description}</p>
        <h1>${work.price}</h1>
        <button type="submit" onClick={addToCart}>
          <ShoppingCart /> ADD TO CART
        </button>
      </div>
    </>
  );
};

export default WorkDetails;
