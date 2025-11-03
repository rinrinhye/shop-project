import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./contexts/CartContext";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./contexts/ModalContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<ModalProvider>
				<AuthProvider>
					<CartProvider>
						<App />
					</CartProvider>
				</AuthProvider>
			</ModalProvider>
		</BrowserRouter>
	</QueryClientProvider>
);
