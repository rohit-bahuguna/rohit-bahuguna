import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { VscDebugBreakpointLog } from "react-icons/vsc"

const ProjectCard = ({ project: { image, heading, tech, githubUrl, liveUrl, description, points } }) => {
    const [showButton, setShowButton] = useState(false)
    return (
        <div className='flex gap-5 py-2 md:px-5 px-1 rounded-xl hover:bg-indigo-300 lg:flex-row flex-col  border border-indigo-700 group'>

            <div className='flex flex-col gap-3 self-center lg:w-screen'>
                <p className='border  bg-indigo-100 group-hover:bg-white p-3 rounded-xl text-lg'>
                    <h1 className='text-3xl mb-2 font-[1000] text-indigo-700 '>{heading}</h1>
                    {description}
                </p>
                <div className='text-black text-lg ml-4 flex flex-col gap-5'>
                    <div className='grid grid-cols-2 gap-3'>
                        {
                            points.map(point => <p> <VscDebugBreakpointLog className='inline text-2xl text-indigo-700' />{point} </p>)
                        }


                    </div>
                    <div className='flex gap-8 text-indigo-900 '>
                        {
                            tech.map(({ title, Icon }, index) => <p key={title}><Icon className="inline text-2xl " /> {title}</p>)
                        }

                    </div>
                </div>

            </div>
            <div className='relative' onMouseOver={() => setShowButton(true)} onMouseOut={() => setShowButton(false)}>
                <img src={image} className='rounded-3xl' />
                {showButton && <div className='absolute  bg-[#0f0f0f89] inset-0 rounded-3xl flex justify-center gap-10 items-center'>
                    <Link to={liveUrl} target='_blank'>
                        <button className='bg-white px-3 sm:px-5 py-1 sm:text-lg text-xs rounded-full text-indigo-700 border border-indigo-700 hover:bg-indigo-200'>View Live Project</button>

                    </Link>
                    <Link to={githubUrl} target='_blank'>
                        <button className='bg-white sm:px-5 px-3 py-1 sm:text-lg text-xs rounded-full text-indigo-700 border border-indigo-700 hover:bg-indigo-200'>View Source Code</button>

                    </Link>
                </div>}
            </div>
        </div >
    )
}

export default ProjectCard