import React from 'react'
import { AiFillGithub, AiFillLinkedin, AiFillInstagram } from "react-icons/ai"
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
const InternalLink = Scroll.Link

const Footer = () => {

  return (
    <>
      <section className=' flex  flex-col  justify-evenly  py-5 bg-[#f3f5f9]'>
        <div className='flex   justify-between'>
          <div className=' hidden sm:block relative w-[30%]'>
            <img src='/Images/rohitsign.png' className=' left-10 top-10  absolute w-[60%] ' />
          </div>
          <div className='flex justify-evenly w-full sm:w-[70%] '>
            <div className=' ' >
              <h3 className='mb-3 uppercase font-semibold '>Account</h3>
              <div className='flex flex-col gap-2'>
                <InternalLink
                  to="about"
                  spy={true}
                  smooth={true}
                  duration={1500} >
                  <p className='hover:text-indigo-700   '>About</p>

                </InternalLink>

                <InternalLink to="projects"
                  spy={true}
                  smooth={true}
                  duration={1500}
                >
                  <p className='hover:text-indigo-700   '>Projects</p>
                </InternalLink>
                <InternalLink
                  to="contact"
                  spy={true}
                  smooth={true}
                  duration={1500}
                >
                  <p className='hover:text-indigo-700   '>Contact</p>
                </InternalLink>
                <Link
                  to="https://drive.google.com/file/d/1J0kPC3TBdtLQpOvORigxMQtoilkYzL4H/view?usp=sharing"
                  target='_blank'
                >
                  <p className='hover:text-indigo-700   '>Resume</p>
                </Link>
              </div>

            </div>
            <div>
              <h3 className='mb-3 uppercase font-semibold' >Connect</h3>
              <div className='flex flex-col gap-3 '>
                <Link to="https://www.linkedin.com/in/rohit--bahuguna" target='#blank'>
                  <p className="hover:text-indigo-700 "> <AiFillLinkedin className='inline text-xl' /> Linkdin</p>
                </Link>


                <Link to="https://github.com/rohit-bahuguna" target='#blank'>
                  <p className="hover:text-indigo-700 "> <AiFillGithub className='inline text-xl' />  GitHub</p></Link>

                <Link to="https://www.instagram.com/the_rohit_bahuguna" target='#blank'>
                  <p className="hover:text-indigo-700 ">  <AiFillInstagram className='inline text-xl' /> InstaGram</p></Link>
              </div>

            </div>
            <div className='hidden sm:block'>
              <h3 className='mb-3 uppercase font-semibold'>Contact</h3>

              <div className='flex flex-col gap-3' >
                <h4 className="">Rohit Bahuguna</h4>
                <p className="">Call / Whatsapp : <span className='contact'>9627944998</span></p>

                <p className="">Email :  <span className='contact'>rohitbahuguna.work@gmail.com</span></p>
              </div>


            </div>
          </div>
        </div>
        <p className='text-center pt-5  text-sm'> © Rohit Bahuguna | 2023 | All rights reserved </p>

      </section>

    </>
  )
}

export default Footer