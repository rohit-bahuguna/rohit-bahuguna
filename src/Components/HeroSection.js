import React from 'react'
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai"
import { Link } from 'react-router-dom'
const HeroSection = () => {
    return (
        <div className='relative flex flex-col gap-10 items-center justify-center mt-10 lg:mt-0  lg:h-[92vh]   lg:items-start  '>

            <div className='flex flex-col'>
                <div className='  lg:absolute  top-1/4 left-20 '>
                    <h1 className='lg:text-[6rem] text-[10vw] sm:text-5xl text-center  font-semibold  dropShadow 
                '>Rohit Bahuguna</h1>
                    <p className='text-[5vw] lg:text-5xl dropShadow  font-semibold text-center   '>
                        Student | Full Stack Developer
                    </p>
                    <p className='flex  justify-center gap-8 mt-3 dropShadow'>
                        <Link to="https://www.linkedin.com/in/rohit--bahuguna" target='#blank'>
                            <AiFillLinkedin className='text-4xl p-1 rounded-full bg-white text-[#3d53bf]' />
                        </Link>


                        <Link to="https://github.com/rohit-bahuguna" target='#blank'>
                            <AiFillGithub className='text-4xl p-1 rounded-full bg-white text-[#3d53bf]' />
                        </Link>

                        <Link to="https://www.instagram.com/the_rohit_bahuguna" target='#blank'>
                            <AiFillInstagram className='text-4xl p-1 rounded-full bg-white text-[#3d53bf]' />
                        </Link>
                    </p>

                </div>

            </div>


            <div>
                <img src="/Images/rohit-bahuguna.png" alt="Rohit Bahuguna" className=' w-screen  lg:w-auto lg:absolute imageShadow  bottom-0 right-10 lg:h-[85vh]  ' />
            </div>


        </div >
    )
}

export default HeroSection