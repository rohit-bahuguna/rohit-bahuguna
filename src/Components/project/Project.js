import React from 'react'
import { projects } from '../../utils/projectData'
import ProjectCard from './ProjectCard'
function Project() {

  return (
    <div className='flex flex-col gap-5' id='projects' >

      <h1 className='text-[8vw] sm:text-4xl text font-semibold text-center uppercase'  >projects</h1>
      <div className='flex flex-col gap-5 md:px-10 px-1 ' >
        {
          projects && projects.map(project => <ProjectCard project={project} />)
        }
      </div>
    </div>
  )
}

export default Project