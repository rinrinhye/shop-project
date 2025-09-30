import {useQuery} from "@tanstack/react-query";
import {CiShoppingCart, CiUser, CiMenuBurger} from "react-icons/ci";
import {getCategoriesQuery} from "../api/categories";
import {Link} from "react-router";

interface Category {
	id: number;
	name: string;
	slug: string;
	image: string;
	creationAt: string;
	updatedAt: string;
}

const Header = () => {
	const {data: categories = [], isLoading} = useQuery<Category[]>(getCategoriesQuery());

	if (isLoading) return;

	return (
		<header className='flex justify-between'>
			<button type='button' className='mobile-only'>
				<CiMenuBurger />
			</button>
			<h1>shop</h1>
			<nav className='desktop-only'>
				<ul className='flex gap-2'>
					{categories.map((category) => (
						<li key={category.id}>
							<Link to={`/products/category/${category.slug}`}>{category.name}</Link>
						</li>
					))}
				</ul>
			</nav>
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
