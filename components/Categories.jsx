import "../styles/Categories.scss"
import { categories } from "@data";

const Categories = () => {
  return (
    <div className="categories">
      {categories.map((item) => (
        <p>{item}</p>
      ))}
    </div>
  );
};

export default Categories;
