import {createRoot} from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {CartProvider} from "./contexts/CartContext";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<CartProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</CartProvider>
	</QueryClientProvider>
);
