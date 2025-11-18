import type { LoginPayload, RegisterPayload, UserPayload } from "../types/common";

const BASE_URL = "https://api.escuelajs.co/api/v1";

export const postLogin = async (value: LoginPayload) => {
	const url = BASE_URL + "/auth/login";

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(value),
	});

	const body = await res.json();

	if (!res.ok) {
		throw body;
	}

	return body;
};

export const getCurrentUser = async (token: string) => {
	let url = BASE_URL + `/auth/profile`;

	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
	});

	const body = await res.json();

	if (!res.ok) {
		throw body;
	}

	return body;
};

export const postRegister = async (value: RegisterPayload) => {
	const url = BASE_URL + "/users/";

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(value),
	});

	const body = await res.json();

	if (!res.ok) {
		throw body;
	}

	return body;
};

export const putUserInfo = async (payload: UserPayload) => {
	const { id, ...rest } = payload;
	const url = BASE_URL + `/users/${id}`;

	const res = await fetch(url, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(rest),
	});
	const body = await res.json();

	return body;
};

export const getAllUser = async () => {
	const url = BASE_URL + `/users`;
	const res = await fetch(url);

	return res.json();
};
