// import { BrowserRouter , Route , Routes  } from 'react-router-dom';
import { BiUpArrowAlt } from "react-icons/bi"
import Scroll from 'react-scroll'
import Header from './Components/Header';
import About from './Components/About';
import Skills from './Components/Skills';
import Project from './Components/project/Project';
import './App.css';
import HeroSection from './Components/HeroSection';
import Contact from './Components/contact/Contact';
import Footer from './Components/Footer';
const Link = Scroll.Link

function App() {
	const height = document.body.scrollHeight
	console.log(height)
	return (
		<div className="flex flex-col gap-8 " id='top'>
			<div className='bg-[#3d53bf] text-[#ffffff] z-10'>
				<Header />
				<HeroSection />
			</div>
			<div className="relative">
				<Skills />
				<About />
				<Project />
				<Contact />
				<Footer />

				<div className='fixed z-0 right-5 bottom-10 hidden sm:block bg-indigo-200 rounded-full p-1 hover:cursor-pointer'>
					<Link
						to="top"
						smooth={true}
						duration={1500}
					>
						<BiUpArrowAlt className="text-4xl text-indigo-700 " />
					</Link>
				</div>
			</div>
		</div>
	);
}

export default App;
