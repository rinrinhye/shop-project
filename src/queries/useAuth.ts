import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getCurrentUser, postEmailAvailable, postLogin, postRegister, putUserInfo } from "../api/auth";
import type { LoginInput, RegisterInput, RegisterPayload } from "../types/common";
import { ROUTES } from "../routes/routes";

export const useLogin = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (value: LoginInput) => postLogin(value),
		onSuccess: (data) => {
			if (data) {
				localStorage.setItem("access_token", data.access_token);
				navigate(ROUTES.home);
			}
		},
	});
};

export const useLogout = () => {
	const qc = useQueryClient();

	return () => {
		localStorage.removeItem("access_token");
		qc.setQueryData(["currentUser"], null);
		qc.removeQueries({ queryKey: ["currentUser"] });
	};
};

export const useRegister = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (value: RegisterPayload) => {
			const data = await postRegister(value);

			const { access_token } = await postLogin({ email: value.email, password: value.password });
			localStorage.setItem("access_token", access_token);

			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["currentUser"] });
			navigate(ROUTES.home);
		},
	});
};

export const useCurrentUser = () => {
	const token = localStorage.getItem("access_token");

	return useQuery({
		queryKey: ["currentUser"],
		queryFn: () => getCurrentUser(token!),
		enabled: !!token,
	});
};

export const useEmailAvailable = () => {
	return useMutation({
		mutationFn: async (email: RegisterInput["email"]) => {
			const data = await postEmailAvailable(email);

			return data;
		},
	});
};

export const useUserUpdate = () => {
	return useMutation({
		mutationFn: async ({ id, newInfo }: { id: string; newInfo: Record<string, any> }) => {
			const data = await putUserInfo({ id, newInfo });

			return data;
		},
	});
};
