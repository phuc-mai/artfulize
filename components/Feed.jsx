import "../styles/Categories.scss";
import { categories } from "@data";
import WorkList from "./WorkList";

import { useState, useEffect } from "react";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [workList, setWorkList] = useState([]);

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(selectedCategory !== "" ? `api/work?category=${selectedCategory}` : "api/work");
      const data = await response.json();
      setWorkList(data);
      console.log(response)
    };

    getWorkList();
  }, [selectedCategory]);

  return (
    <>
      <div className="categories">
        {categories.map((item) => (
          <p
            className={`${item === selectedCategory ? "selected" : ""}`}
            onClick={() => setSelectedCategory(item)}
          >
            {item}
          </p>
        ))}
      </div>

      <WorkList data={workList} />
    </>
  );
};

export default Feed;
