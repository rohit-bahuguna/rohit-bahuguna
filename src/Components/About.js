import React from 'react';

function About() {
	return (
		<article id='about' className=' flex flex-col  gap-3 py-10 px-2'>
			<h4 className=' lg:hidden self-center text-[7vw] mb-5  font-semibold'>
				Hey, I am <span className=' underline  underline-offset-4  py-2 decoration-[#ff8800]'>Rohit Bahuguna</span>
			</h4>
			<div className='flex md:flex-row flex-col gap-3 md:gap-0 justify-center items-center lg:gap-10'>
				<div className=' md:px-10 px-2 md:w-[50vw]'>
					<h4 className='hidden lg:block text-5xl mb-5  font-semibold'>
						Hey, I am <span className=' underline  underline-offset-4  py-2 decoration-[#ff8800]'>Rohit Bahuguna</span>
					</h4>
					<p className='md:text-xl text-[3vw] flex flex-col gap-3'>
						<p className='first-letter:font-semibold '>
							A skilled <span className='italic font-semibold'>Full Stack Developer</span> specializing in the MERN stack, possessing a strong technical acumen and a confident approach to problem-solving.
							With the vision to become an expert in the field , I'am continually learning and staying updated with the latest web development trends and best practices .
						</p>

						<p>With a solid background in Javascript , MongoDB, Express, React, and Node.js, I have successfully delivered a wide range of web applications and projects.</p>

						<p>	I am eager to take on new challenges and contribute to the success of innovative projects and seeking to expand my skill set and take on new challenges.
						</p>
						<p>Let's build something exceptional together.</p>

					</p>

				</div>

				<div>
					<img src="/Images/IMG20220611203623.jpg" alt="Rohit Bahuguna" className='md:h-[60vh] w-[80vw] md:w-auto shadow-gray-500 shadow-xl drop-shadow-xl rounded-xl '
						title='Rohit Bahuguna' />
				</div>


			</div>


		</article>
	);
}

export default About;
