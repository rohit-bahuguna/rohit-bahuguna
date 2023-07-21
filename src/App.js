// import { BrowserRouter , Route , Routes  } from 'react-router-dom';

import Header from './Components/Header';
import About from './Components/About';
import Skills from './Components/Skills';
import Project from './Components/Project';
import Social from './Components/Social';

import './App.css';
function App() {
	return (
		<div className="bg-[#31344F] text-white">
			<Header />
			<About />
			<Skills />
			<Project />
			<Social />
		</div>
	);
}

export default App;
