import WorkCard from "./WorkCard"
import "../styles/WorkList.scss"

const WorkList = ({ data, handleDelete }) => {
  return (
    <div className="work-list">
      {data.map((work) => (
        <WorkCard
          key={work._id}
          work={work}
          handleDelete={handleDelete && handleDelete(work)}
        />
      ))}
    </div>
  )
}

export default WorkList