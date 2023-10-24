import "../styles/Categories.scss";
import { categories } from "@data";
import WorkList from "./WorkList";

import { useState, useEffect } from "react";
import Loader from "./Loader";

const Feed = ({searchWorkList = ""}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [workList, setWorkList] = useState(searchWorkList);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(selectedCategory !== "" ? `api/work/list/${selectedCategory}` : "api/work/list/all");
      const data = await response.json();
      setWorkList(data);
      setLoading(false);
    };

    if(searchWorkList == "") getWorkList();
    else setLoading(false);
  }, [selectedCategory]);

  
  const handleDelete = async (work) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id.toString()}`, {
          method: "DELETE",
        });

        const filteredWork = workList.filter((item) => item._id !== work._id);

        setWorkList(filteredWork);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return loading ? <Loader/> : (
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

      <WorkList data={workList} handleDelete={handleDelete} />
    </>
  );
};

export default Feed;
