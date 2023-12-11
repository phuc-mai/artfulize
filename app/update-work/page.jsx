"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "@components/Navbar";
import Form from "@components/Form";
import Loader from "@components/Loader";
import { useSession } from "next-auth/react";

const UpdateForm = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  const [work, setWork] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    photos: [],
  });

  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`api/work/${workId}`);
      const data = await response.json();

      setWork({
        category: data.category,
        title: data.title,
        description: data.description,
        price: data.price,
        photos: data.workPhotosPaths,
      });

      setLoading(false);
    };

    if (workId) getWorkDetails();
  }, [workId]);

  const handlePost = async (e) => {
    e.preventDefault();

    if (!workId) return alert("Missing WorkId!");

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

      /* Send a PATCH request to your server to edit the existing work */
      const response = await fetch(`/api/work/${workId}`, {
        method: "PATCH",
        body: formData
      });

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`);
      }
    } catch (error) {
      console.log("Publish Work failed", error.message);
    }
  };

  console.log(work)

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <Form
        type="Update"
        work={work}
        setWork={setWork}
        handlePost={handlePost}
      />
    </>
  );
};

export default UpdateForm;
