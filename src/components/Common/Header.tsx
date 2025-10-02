import {Link, useNavigate} from "react-router";
import {ROUTES} from "../../routes/routes";
import {useCurrentUser} from "../../queries/useAuth";
import {useCategories} from "../../queries/useProducts";
import type {Category} from "../../types/common";
import {CiShoppingCart, CiUser, CiMenuBurger} from "react-icons/ci";

const Header = () => {
	const {data: categories = [], isLoading} = useCategories();

	const navigate = useNavigate();

	const {data: user} = useCurrentUser();

	const handleUserButton = () => {
		navigate(ROUTES.user(user.id));
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
					{categories.map((category: Category) => (
						<li key={category.id}>
							<Link to={ROUTES.products(category.slug)}>{category.name}</Link>
						</li>
					))}
				</ul>
			</nav>
			<div>
				{!user && (
					<>
						<Link to={ROUTES.login}>login</Link>
						<Link to={ROUTES.register}>join</Link>
					</>
				)}
				{user && (
					<button type='button' onClick={handleUserButton}>
						<CiUser />
					</button>
				)}
				<button type='button'>
					<CiShoppingCart />
				</button>
			</div>
		</header>
	);
};

export default Header;
