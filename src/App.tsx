import { Route, Routes } from "react-router";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ROUTES } from "./routes/routes";
import User from "./pages/User";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "sonner";
import { useIsMobile } from "./hooks/useIsMobile";

export default function App() {
	const isMobile = useIsMobile();

	return (
		<>
			<Routes>
				<Route path={ROUTES.home} element={<RootLayout />}>
					<Route index element={<Home />} />
					<Route element={<ProtectedRoute />}>
						<Route path='user/:userId' element={<User />} />
					</Route>
					<Route path='category/:categorySlug' element={<Products />} />
					<Route path='/products/:id' element={<ProductDetail />} />
					<Route path={ROUTES.cart} element={<Cart />} />
					<Route path={ROUTES.login} element={<Login />} />
					<Route path={ROUTES.register} element={<Register />} />
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
			<Toaster
				position={!isMobile ? "top-right" : "top-center"}
				toastOptions={{
					duration: 3000,
				}}
			/>
		</>
	);
}

/* 
🐝 category vs :id 충돌 주의!

	기존 : 
	카테고리 'products/:category'
	상품상세 'products/:id'

	변경	: 
	카테고리 'products/category/:category'
	상품상세 'products/:id'

	-----------------------------------------------
	존재하는 값으로만 이동 가능하게 수정 필요!

*/
