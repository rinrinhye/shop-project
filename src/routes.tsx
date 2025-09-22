import {createBrowserRouter} from "react-router";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <NotFound />,
		children: [
			{index: true, element: <Home />},
			{
				path: "products",
				element: <Products />,
			},

			{
				path: "products/:id",
				element: <ProductDetail />,
			},

			{
				path: "cart",
				element: <Cart />,
			},

			{path: "*", element: <NotFound />},
		],
	},
]);

export default router;
