import React from 'react'
import { Link } from 'react-router-dom'

const NavLink = () => {
    return (
        <>
            <Link to="#about">
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>About</p>

            </Link>
            <Link>
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>Project</p>
            </Link>
            <Link>
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>Connect</p>
            </Link>
            <Link>
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>Resume</p>
            </Link>
        </>
    )
}

export default NavLink