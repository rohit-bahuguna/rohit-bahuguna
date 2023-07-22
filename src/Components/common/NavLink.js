import React from 'react'
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai"
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
const InternalLink = Scroll.Link

const NavLink = () => {
    return (
        <>
            <InternalLink
                to="about"
                spy={true}
                smooth={true}
                duration={1500}
            >
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>About</p>

            </InternalLink>
            <InternalLink
                to="projects"
                spy={true}
                smooth={true}
                duration={1500}
            >
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>Project</p>
            </InternalLink>
            <InternalLink
                to="contact"
                spy={true}
                smooth={true}
                duration={1500}
            >
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>Contact</p>
            </InternalLink>
            <Link to="https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing"
                target='_blank'
            >
                <p className='hover:bg-indigo-100 px-5 py-1 hover:text-indigo-700 text-lg md:rounded-lg md:text-xl text-white '>Resume</p>
            </Link>
        </>
    )
}

export default NavLink