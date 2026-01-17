import { useState } from 'react'

interface Project {
  name: string
  description: string
  url: string
  language: string | null
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project-card-inner">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-description">{project.description || 'View project on GitHub'}</p>
        {project.language && <span className="project-language">{project.language}</span>}
      </div>
      <div className={`project-hover-indicator ${isHovered ? 'active' : ''}`}>→</div>
    </a>
  )
}
