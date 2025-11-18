import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getAllUser, getCurrentUser, postLogin, postRegister, putUserInfo } from "../api/auth";
import type { LoginForm, RegisterPayload, User, UserPayload } from "../types/common";
import { ROUTES } from "../routes/routes";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export const useLogin = () => {
	const navigate = useNavigate();
	const { saveToken } = useAuth();

	return useMutation({
		mutationFn: (value: LoginForm) => {
			const { origin, ...payload } = value;
			return postLogin(payload);
		},
		onMutate: (value) => ({ origin: value.origin ?? "login" }),
		onSuccess: (data, _vars, ctx) => {
			saveToken(data.access_token);
			navigate(ROUTES.home);
			if (ctx?.origin === "signup") toast.success("회원가입이 완료되었습니다.");
			else toast.success("로그인 되었습니다.");
		},
	});
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
	const { token } = useAuth();

	return useQuery({
		queryKey: ["currentUser"],
		queryFn: () => getCurrentUser(token!),
		enabled: !!token,
		retry: 0,
	});
};

export const useUserUpdate = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: UserPayload) => {
			const data = await putUserInfo(payload);

			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["currentUser"] });
			toast.success("프로필 정보가 수정되었습니다.");
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
