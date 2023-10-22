"use client";
import Navbar from "@components/Navbar";
import Form from "@components/Form";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { data } from "autoprefixer";
import Loader from "@components/Loader";

const CreateWork = () => {
  const router = useRouter();
  const { data: session } = useSession();
  // const [loading, setLoading] = useState(true);

  const [work, setWork] = useState({
    creator: "",
    category: "",
    title: "",
    description: "",
    price: "",
    photos: [],
  });

  if (session) {
    work.creator = session?.user?._id // Loading "session" takes time, so it can be undefined
  }

  console.log(work)

  // useEffect(() => {
  //   if(!session || !loading) return; // loading "session" takes time, so it can be undefined, must have loading
  //   setWork({
  //     creator: session?.user?._id,
  //     category: "",
  //     title: "",
  //     description: "",
  //     price: "",
  //     photos: [],
  //   });
  //   setLoading(false);
  // }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => {
      return {
        ...prevWork,
        [name]: value,
      };
    });
  };

  /* UPLOAD & REMOVE PHOTOS */
  
  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: [...prevWork.photos, ...newPhotos],
      };
    });
  };

  const handleRemovePhoto = (indexToRemove) => {
    setWork((prevWork) => {
      return {
        ...prevWork,
        photos: prevWork.photos.filter((_, index) => index !== indexToRemove),
      };
    });
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(work.photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWork({ ...work, photos: items });
  };

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      /* Create a new FormData object to handle file uploads */
      const formData = new FormData();

      // key in [key, value] --> key = "name"
      for (var key in work) {
        formData.append(key, work[key]);
      }

      /* Append each selected photo to the FormData object */
      work.photos.forEach((photo) => {
        formData.append("workPhotosPaths", photo);
      });

      /* Send a POST request to your server to add the Listing */
      const response = await fetch("/api/work/new", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log("Publish Work failed", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Form
        type="Create"
        work={work}
        setWork={setWork}
        handleDragPhoto={handleDragPhoto}
        handleRemovePhoto={handleRemovePhoto}
        handleUploadPhotos={handleUploadPhotos}
        handleChange={handleChange}
        handlePost={handlePost}
      />
    </>
  );
};

export default CreateWork;