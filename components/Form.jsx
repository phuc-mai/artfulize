import "../styles/Form.scss";
import { categories } from "@data";

import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Form = ({
  type,
  work,
  setWork,
  handleDragPhoto,
  handleRemovePhoto,
  handleUploadPhotos,
  handleChange,
  handlePost,
}) => {
  return (
    <div className="form">
      <h1>{type} Your Work</h1>
      <form onSubmit={handlePost} noValidate>
        <h3>Which of these categories best describes your work?</h3>
        <div className="category-list">
          {categories?.map((item, index) => (
            <p
              className={`${work.category === item ? "selected" : ""}`}
              key={index}
              onClick={() => {
                setWork({ ...work, category: item });
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
                {work.photos.length >= 1 && (
                  <>
                    {work?.photos?.map((photo, index) => {
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
                              {photo instanceof Object ? (
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt="place"
                                />
                              ) : (
                                <img src={photo} alt="place" />
                              )}
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
                {work.photos.length < 1 && (
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
            onChange={handleChange}
            name="title"
            value={work.title}
            required
          />
          <p>Description</p>
          <textarea
            placeholder="Description"
            onChange={handleChange}
            name="description"
            value={work.description}
            required
          />
          <p>Now, set your PRICE</p>
          <span>$</span>
          <input
            type="number"
            placeholder="Price"
            onChange={handleChange}
            name="price"
            value={work.price}
            required
            className="price"
          />
        </div>

        <button className="submit_btn" type="submit">
          PUBLISH YOUR WORK
        </button>
      </form>
    </div>
  );
};

export default Form;
