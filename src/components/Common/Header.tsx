import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useCurrentUser } from "../../queries/useAuth";
import { useCategories } from "../../queries/useProducts";
import type { Category } from "../../types/common";
import { CiShoppingCart, CiUser, CiMenuBurger } from "react-icons/ci";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";

const Header = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { confirm } = useModal();
	const [isClick, setClick] = useState(false);
	const canHover = window.matchMedia("(hover: hover)").matches;

	const { data: categories = [] } = useCategories();
	const { data: user, isError: isUserError, error: userError } = useCurrentUser();
	const { totalCount } = useCart();

	useEffect(() => {
		console.log(userError);

		if (isUserError) {
			const err = userError as { statusCode?: number };
			if (err.statusCode === 401 || 400) {
				alert("토큰 만료");
				logout();
			}
		}
	}, [isUserError, userError]);

	const handleUserButton = () => {
		if (!user) {
			navigate(ROUTES.login);
		}
	};

	const handleCartButton = () => {
		navigate(ROUTES.cart);
	};

	const enterUserDropdown = () => {
		if (!canHover) {
			setClick(true);
		}
	};

	const leaveUserDropdown = () => {
		if (!canHover) {
			setClick(false);
		}
	};

	const handleLogout = async () => {
		const ok = await confirm("로그아웃 할까요?");
		if (!ok) return;

		logout();
	};

	return (
		<header>
			<div className='relative h-14 px-4 flex justify-between items-center md:h-20 md:px-8'>
				<button type='button' className='mobile-only'>
					<CiMenuBurger size={24} />
				</button>
				<h1 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-[Outfit] font-bold'>
					<Link to='/'>SHOP</Link>
				</h1>
				<nav className='mobile-hidden'>
					<ul className='flex md:gap-3 lg:gap-4'>
						{categories.map((category: Category, i: number) => {
							if (i > 4) return;
							return (
								<li key={category.id}>
									<Link to={ROUTES.products(category.slug)}>{category.name}</Link>
								</li>
							);
						})}
					</ul>
				</nav>
				<div className='h-full flex items-center gap-3 md:gap-4 lg:gap-6'>
					{!user && (
						<>
							<Link to={ROUTES.login} className='hidden lg:block'>
								LOGIN
							</Link>
							<Link to={ROUTES.register} className='hidden lg:block'>
								JOIN
							</Link>
						</>
					)}

					<div
						onMouseEnter={enterUserDropdown}
						onMouseLeave={leaveUserDropdown}
						className={`relative h-full group font-[Outfit] inline-flex ${user ? "" : "lg:hidden"}`}>
						<button type='button' onClick={handleUserButton}>
							<CiUser size={28} />
						</button>
						{user && (
							<div
								className={` transition absolute z-10 top-[calc(100%)] left-1/2 -translate-x-1/2 py-2 border border-[#d8d8d8] bg-white rounded-md whitespace-nowrap text-base ${
									isClick
										? "opacity-100 translate-y-0 md:-translate-y-2 pointer-events-auto"
										: "opacity-0 translate-y-[10px] pointer-events-none"
								} group-hover:opacity-100 group-hover:translate-y-0 md:group-hover:-translate-y-2 group-hover:pointer-events-auto`}>
								<ul>
									<li className='hover:text-[#ef4da2]'>
										<Link to={ROUTES.user(user.id)} className='block px-4 py-1 md:px-6 md:py-2.5'>
											My Page
										</Link>
									</li>
									<li className='hover:text-[#ef4da2]'>
										<button
											type='button'
											onClick={handleLogout}
											className='px-4 py-1 md:px-6 md:py-2.5'>
											Logout
										</button>
									</li>
								</ul>
							</div>
						)}
					</div>

					<button type='button' onClick={handleCartButton} className='relative'>
						<CiShoppingCart size={32} />
						{totalCount !== 0 && (
							<span className='font-[Outfit] absolute top-0 right-[-3px] px-1.5 rounded-full bg-[#ef4da2] text-[10px] text-white'>
								{totalCount}
							</span>
						)}
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
