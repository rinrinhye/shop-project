import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getAllUser, getCurrentUser, postLogin, postRegister, putUserInfo } from "../api/auth";
import type { LoginInput, RegisterPayload, User } from "../types/common";
import { ROUTES } from "../routes/routes";

export const useLogin = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (value: LoginInput) => postLogin(value),
		onSuccess: (data) => {
			localStorage.setItem("access_token", data.access_token);
			navigate(ROUTES.home);
		},
	});
};

export const useLogout = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return () => {
		localStorage.removeItem("access_token");
		qc.setQueryData(["currentUser"], null);
		qc.removeQueries({ queryKey: ["currentUser"] });
		navigate(ROUTES.home);
	};
};

export const useRegister = () => {
	return useMutation({
		mutationFn: async (value: RegisterPayload) => {
			const data = await postRegister(value);

			return data;
		},
	});
};

export const useCurrentUser = () => {
	const token = localStorage.getItem("access_token");

	return useQuery({
		queryKey: ["currentUser", token],
		queryFn: () => getCurrentUser(),
		enabled: !!token,
		retry: 0,
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

export const useAllUserEmail = () => {
	return useQuery({
		queryKey: ["allUser"],
		queryFn: () => getAllUser(),
		select: (data) => new Set(data.map((user: User) => user.email)),
	});
};
