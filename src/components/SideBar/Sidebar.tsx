import { Link } from "react-router";
import { createPortal } from "react-dom";
import { useCategories } from "../../queries/useProducts";
import { useCurrentUser } from "../../queries/useAuth";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { useCart } from "../../contexts/CartContext";
import { ROUTES } from "../../routes/routes";
import { useScrollLock } from "../../hooks/useScrollLock";
import type { Category } from "../../types/common";

interface Props {
	open: boolean;
	onClose: () => void;
}

const Sidebar = ({ open, onClose }: Props) => {
	const { data: categories = [] } = useCategories();
	const { data: user } = useCurrentUser();
	const { removeToken } = useAuth();
	const { confirm } = useModal();
	const { totalCount } = useCart();

	useScrollLock(open);

	const handleLogout = async () => {
		const ok = await confirm("로그아웃 할까요?");
		if (!ok) return;
		removeToken();
		onClose();
	};

	if (!open) return null;

	return createPortal(
		<div>
			<div onClick={onClose} className='fixed inset-0 bg-black/40 z-40 transition-opacity opacity-100' />

			<aside
				className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl
          transform transition-transform duration-300
          translate-x-0
        `}>
				<div className='p-4 flex justify-between items-center border-b border-gray-100'>
					<h2 className='font-outfit text-lg font-bold'>MENU</h2>
					<button onClick={onClose} className='text-xl'>
						×
					</button>
				</div>

				<div className='p-4 flex flex-col gap-4 font-outfit'>
					<nav>
						<h3 className='font-semibold mb-2'>Categories</h3>
						<ul className='flex flex-col gap-2'>
							{categories.slice(0, 10).map((category: Category) => (
								<li key={category.id}>
									<Link
										to={ROUTES.products(category.slug)}
										onClick={onClose}
										className='block py-1 hover:text-primary'>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div>
						<h3 className='font-semibold mb-2'>Account</h3>

						{!user ? (
							<div className='flex flex-col gap-2'>
								<Link to={ROUTES.login} onClick={onClose}>
									Login
								</Link>
								<Link to={ROUTES.register} onClick={onClose}>
									Join
								</Link>
							</div>
						) : (
							<div className='flex flex-col gap-2'>
								<Link to={ROUTES.user(user.id)} onClick={onClose}>
									My Page
								</Link>
								<button type='button' onClick={handleLogout} className='text-left'>
									Logout
								</button>
							</div>
						)}
					</div>

					<div>
						<h3 className='font-semibold mb-2'>Cart</h3>
						<Link to={ROUTES.cart} onClick={onClose}>
							cart ({totalCount})
						</Link>
					</div>
				</div>
			</aside>
		</div>,
		document.body
	);
};

export default Sidebar;
