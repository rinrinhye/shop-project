import {CiShoppingCart, CiUser, CiMenuBurger} from "react-icons/ci";

const Header = () => {
	return (
		<header className='flex justify-between'>
			<button type='button' className='mobile-only'>
				<CiMenuBurger />
			</button>
			<h1>shop</h1>
			<nav className='desktop-only'></nav>
			<div>
				<button type='button'>
					<CiUser />
				</button>
				<button type='button'>
					<CiShoppingCart />
				</button>
			</div>
		</header>
	);
};

export default Header;
