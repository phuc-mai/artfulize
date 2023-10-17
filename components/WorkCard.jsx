import "../../styles/ListingCard.scss";
import variables from "../../styles/variables.scss";

import { useState } from "react";
import {
  Favorite,
  ArrowForwardIos,
  ArrowBackIosNew,
} from "@mui/icons-material";

const ListingCard = ({
  listingId,
  listingPhotosPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  booking,
  startDate,
  endDate,
  totalPrice,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    const response = await fetch(
      `https://homeheavenserver.phucmai.com/users/${user._id}/${listingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setWishList(data.wishlist));
  };

  /* SLIDER FOR IMAGES */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotosPaths.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotosPaths.length) % listingPhotosPaths.length
    );
  };

  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotosPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`https://homeheavenserver.phucmai.com/${photo.replace("public", "")}`}
                alt={`photo ${index + 1}`}
              />
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

      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>

      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>

          <p>
            <span>${totalPrice}</span> total
          </p>
        </>
      )}

      <div
        className="favorite"
        onClick={(e) => {
          patchWishList();
          e.stopPropagation();
        }}
      >
        {isLiked ? (
          <Favorite sx={{ color: variables.pinkred }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
