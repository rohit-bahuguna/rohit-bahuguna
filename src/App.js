// import { BrowserRouter , Route , Routes  } from 'react-router-dom';

import Header from './Components/Header';
import About from './Components/About';
import Skills from './Components/Skills';
import Project from './Components/project/Project';
import Social from './Components/Social';

import './App.css';
import HeroSection from './Components/HeroSection';
import Contact from './Components/contact/Contact';
function App() {
	return (
		<div className="flex flex-col gap-3 ">
			<div className='bg-[#3d53bf] text-[#ffffff]'>
				<Header />
				<HeroSection />

			</div>


			<Skills />
			<About />
			<Project />
			<Contact />
			<Social />

		</div>
	);
}

export default App;
