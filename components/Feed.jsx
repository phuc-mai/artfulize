import "../styles/Categories.scss";
import { categories } from "@data";
import List from "./List";

import { useState, useEffect } from "react";
import Loader from "./Loader";

const Feed = ({ searchWorkList = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState(searchWorkList);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(
        selectedCategory !== ""
          ? `api/work/list/${selectedCategory}`
          : "api/work/list/All"
      );
      const data = await response.json();
      setWorkList(data);
      setLoading(false);
    };

    if (searchWorkList === "") {
      getWorkList();
    } else {
      setLoading(false);
    }
  }, [selectedCategory]);

  return loading ? (
    <Loader />
  ) : (
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

      <List data={workList} setWorkList={setWorkList} />
    </>
  );
};

export default Feed;
