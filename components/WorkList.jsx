import WorkCard from "./WorkCard"
import "../styles/WorkList.scss"

const WorkList = ({ data }) => {
  return (
    <div className="work-list">
      {data.map((work) => (
        <WorkCard
          key={work._id}
          work={work}
        />
      ))}
    </div>
  )
}

export default WorkList