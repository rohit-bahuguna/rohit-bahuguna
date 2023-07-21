import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi"
import NavLink from './common/NavLink';
function Header() {
	const [showMenu, setShowMenu] = useState(false)

	const modelRef = useRef()


	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (modelRef && modelRef.current && !modelRef.current.contains(event.target)) {
				setShowMenu(false)
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);

		return () => {
			document.addEventListener("mousedown", handleOutsideClick);
		};
	}, [modelRef]);

	return (
		<nav className='flex  text-black justify-between relative  px-3 md:px-5   h-[8vh]   items-center'>

			<div className=''>
				<img src='/Images/rohitsign.png' className='md:w-[40%] w-[50vw] mt-2 h-auto contrast-200 brightness-200 ' />
			</div>


			<GiHamburgerMenu className='md:hidden text-3xl' onClick={() => setShowMenu(true)} />

			{showMenu ? <div className=" z-10 absolute top-4 right-3 bg-[#3d53bf] border  flex flex-col justify-center text-center rounded"
				ref={modelRef}
			>
				<NavLink />
			</div>
				:
				<div className='hidden   md:flex gap-5 rounded-xl px-5'>
					<NavLink />
				</div>
			}
		</nav>
	);
}

export default Header;
