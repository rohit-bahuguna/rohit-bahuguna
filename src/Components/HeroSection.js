import React from 'react'

const HeroSection = () => {
    return (
        <div className='relative flex flex-col gap-10 items-center justify-center mt-10 lg:mt-0  lg:h-[92vh]   lg:items-start  '>

            <div className=''>
                <div className='  lg:absolute  top-1/4 left-20 '>
                    <h1 className='lg:text-[6rem] text-[10vw] sm:text-5xl text-center  font-semibold  dropShadow 
                '>Rohit Bahuguna</h1>
                    <p className='text-[5vw] lg:text-5xl dropShadow  font-semibold text-center   '>
                        Student | Full Stack Developer
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