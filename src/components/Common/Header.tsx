import {useQuery} from "@tanstack/react-query";
import {CiShoppingCart, CiUser, CiMenuBurger} from "react-icons/ci";
import {getCategoriesQuery} from "../../queries/queries";
import {Link, useNavigate} from "react-router";
import type {Category} from "../../types/common";

const Header = () => {
	const {data: categories = [], isLoading} = useQuery<Category[]>(getCategoriesQuery());

	const navigate = useNavigate();

	const handleUserButton = () => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		}
	};

	if (isLoading) return;

	return (
		<header className='flex justify-between'>
			<button type='button' className='mobile-only'>
				<CiMenuBurger />
			</button>
			<h1>
				<Link to='/'>shop</Link>
			</h1>
			<nav className='mobile-hidden'>
				<ul className='flex gap-2'>
					{categories.map((category) => (
						<li key={category.id}>
							<Link to={`/products/category/${category.slug}`}>{category.name}</Link>
						</li>
					))}
				</ul>
			</nav>
			<div>
				<button type='button' onClick={handleUserButton}>
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
