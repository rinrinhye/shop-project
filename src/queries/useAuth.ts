import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router";
import {getCurrentUser, postLogin, postRegister} from "../api/auth";
import type {LoginInput, RegisterInput} from "../types/common";
import {ROUTES} from "../routes/routes";

export const useLogin = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (value: LoginInput) => postLogin(value),
		onSuccess: (data) => {
			console.log(data);
			localStorage.setItem("access_token", data.access_token);
			navigate(ROUTES.home);
		},
	});
};

export const useRegister = () => {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (value: RegisterInput) => {
			const res = await postRegister(value);

			if (!res.ok) {
				const body = await res.json();
				throw new Error(body.message);
			}

			const {access_token} = await postLogin({email: value.email, password: value.password});
			localStorage.setItem("access_token", access_token);

			return await res.json();
		},
		onSuccess: () => {
			qc.invalidateQueries({queryKey: ["currentUser"]});
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
