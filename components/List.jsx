import WorkCard from "./WorkCard"
import "../styles/WorkList.scss"

const List = ({ data, setWorkList }) => {

  console.log(data)
  const handleDelete = async (work) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/work/${work._id}`, {
          method: "DELETE",
        });

        const filteredWork = data.filter((item) => item._id !== work._id);

        setWorkList(filteredWork);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="work-list">
      {data.map((work) => (
        <WorkCard
          key={work._id}
          work={work}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default List