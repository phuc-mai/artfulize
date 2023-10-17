"use client";
import "../../styles/CreateWork.scss";
import Navbar from "@components/Navbar";
import { categories } from "@data";

import { useSession } from "next-auth/react";

import { useState } from "react";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const CreateListing = () => {
  const { data: session } = useSession();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();

  /* UPLOAD & REMOVE PHOTOS */
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      /* Create a new FormData object to handle file uploads */
      const formData = new FormData();
      formData.append("ownerId", session?.user.id);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);

      /* Append each selected photo to the FormData object */
      photos.forEach((photo) => {
        formData.append("workPhotosPaths", photo);
      });

      /* Send a POST request to your server to add the Listing */
      const response = await fetch("/api/work/new", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // router.push(`/${_id}/properties`);
        router.push("/");
      }
    } catch (error) {
      console.log("Publish Work failed", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-work">
        <h1>Publish Your Work</h1>
        <form onSubmit={handlePost} noValidate>
          <h3>Which of these categories best describes your work?</h3>
          <div className="category-list">
            {categories?.map((item, index) => (
              <p
                className={`${category === item ? "selected" : ""}`}
                key={index}
                onClick={() => {
                  setCategory(item);
                }}
              >
                {item}
              </p>
            ))}
          </div>

          <h3>Add some photos of your place</h3>
          <DragDropContext onDragEnd={handleDragPhoto}>
            <Droppable droppableId="photos" direction="horizontal">
              {(provided) => (
                <div
                  className="photos"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {photos.length >= 1 && (
                    <>
                      {photos.map((photo, index) => {
                        return (
                          <Draggable
                            key={index}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="photo"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt="place"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(index)}
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      <input
                        type="file"
                        id="image"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleUploadPhotos}
                        multiple
                      />
                      <label htmlFor="image" className="together">
                        <div className="icon">
                          <IoIosImages />
                        </div>
                        <p>Upload from your device</p>
                      </label>{" "}
                    </>
                  )}
                  {photos.length < 1 && (
                    <>
                      <input
                        type="file"
                        id="image"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleUploadPhotos}
                        multiple
                      />
                      <label htmlFor="image" className="alone">
                        <div className="icon">
                          <IoIosImages />
                        </div>
                        <p>Upload from your device</p>
                      </label>{" "}
                    </>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <h3>What make your Work attractive?</h3>
          <div className="description">
            <p>Title</p>
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              value={title}
              required
            />
            <p>Description</p>
            <textarea
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              value={description}
              required
            />
            <p>Now, set your PRICE</p>
            <span>$</span>
            <input
              type="number"
              placeholder="100"
              onChange={(e) => setPrice(e.target.value)}
              name="price"
              value={price}
              required
              className="price"
            />
          </div>

          <button className="submit_btn" type="submit">
            CREATE YOUR WORK
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateListing;
