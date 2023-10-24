import WorkCard from "./WorkCard"
import "../styles/WorkList.scss"

const WorkList = ({ data, handleDelete = (work) => {} }) => {
  
  return (
    <div className="work-list">
      {data.map((work) => (
        <WorkCard
          key={work._id}
          work={work}
          handleDelete={() => { handleDelete(work) }}
        />
      ))}
    </div>
  )
}

export default WorkList