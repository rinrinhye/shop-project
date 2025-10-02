import type {LoginInput, RegisterInput} from "../types/common";

const BASE_URL = "https://api.escuelajs.co/api/v1";

export const postLogin = async (value: LoginInput) => {
	const url = BASE_URL + "/auth/login";

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(value),
	});

	return res.json();
};

export const getCurrentUser = async (token: string) => {
	let url = BASE_URL + `/auth/profile`;

	const res = await fetch(url, {
		headers: {Authorization: `Bearer ${token}`},
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.message || "Unauthorized");
	}

	return res.json();
};

export const postRegister = async (value: RegisterInput) => {
	const url = BASE_URL + "/users/";

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(value),
	});

	return res.json();
};
