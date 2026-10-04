import { iconMap } from "../technoIcons";

type ProjectListProps = {
  projects: { title: string, year: string, type: string, image: string, technos: Array<string>, url: string }[],
  currentUrl: string, // url of the project currently opened in the info panel
  showInfoDiv: boolean,
  openProject: (url: string) => void;
};

const ProjectList = ({ projects, currentUrl, showInfoDiv, openProject }: ProjectListProps) => {

  return (
    <div className="project-list">
      {projects.map((project) => (
        <div key={project.url}
          className={(showInfoDiv && currentUrl === project.url) ? "project-line active" : "project-line"}
          tabIndex={0}
          onClick={() => openProject(project.url)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(project.url); } }}>
          <img src={"/img" + project.image} alt="" loading="lazy" decoding="async" />
          <div className="title-year">
            <h2 className="title">{project.title}</h2>
            <div className="meta">
              <span className="type">{project.type}</span>
              <span className="year">{project.year}</span>
            </div>
          </div>
          <div className="icons">
            {project.technos.map((tech) => (
              <div key={tech} title={tech}>{iconMap[tech]}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
};

export default ProjectList;
