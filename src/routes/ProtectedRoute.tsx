import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "./routes";

export default function ProtectedRoute() {
	const { token } = useAuth();

	if (!token) return <Navigate to={ROUTES.home} replace />;

	return <Outlet />;
}
