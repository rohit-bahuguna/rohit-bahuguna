import React from 'react'
import { FaJava } from 'react-icons/fa'
import { SiCss3, SiHtml5, SiExpress, SiMongodb, SiNextdotjs, SiReact, SiRedux, SiNodedotjs, SiTailwindcss, SiJavascript, SiGit } from 'react-icons/si'
function Skills() {
  const Icons = [SiHtml5, SiCss3, SiJavascript, SiReact, SiTailwindcss, SiNextdotjs, SiNodedotjs, SiRedux, SiExpress, SiMongodb, FaJava, SiGit]
  return (
    <div className='py-2  flex flex-col items-center  sm:items-stretch gap-8' >
      <h1 className='text-[8vw] sm:text-4xl text font-semibold text-center uppercase'>
        Skill Acquired
      </h1>


      <div className='text-indigo-700 gap-5 py-1 flex justify-evenly flex-wrap	'>

        {
          Icons.map(Icon => <div className='skill '>
            <Icon className='skillIcon ' />
          </div>)
        }

      </div>

    </div>
  )
}

export default Skills