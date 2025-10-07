import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useCurrentUser } from "../../queries/useAuth";
import { useCategories } from "../../queries/useProducts";
import type { Category } from "../../types/common";
import { CiShoppingCart, CiUser, CiMenuBurger } from "react-icons/ci";
import { useCart } from "../../contexts/CartContext";

const Header = () => {
  const navigate = useNavigate();

  const { data: categories = [], isLoading } = useCategories();
  const { data: user } = useCurrentUser();
  const { totalCount } = useCart();

  const handleUserButton = () => {
    if (user) {
      navigate(ROUTES.user(user.id));
    } else {
      navigate(ROUTES.login);
    }
  };

  const handleCartButton = () => {
    navigate(ROUTES.cart);
  };

  if (isLoading) return;

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
            {categories.map((category: Category) => (
              <li key={category.id}>
                <Link to={ROUTES.products(category.slug)}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className='flex items-center gap-3 md:gap-4 lg:gap-6'>
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
          <button
            type='button'
            onClick={handleUserButton}
            className={`${user ? "block" : "lg:hidden"}`}
          >
            <CiUser size={28} />
          </button>
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
