import type { LoginInput, RegisterInput, RegisterPayload } from "../types/common";

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

export const putUserInfo = async ({ id, newInfo }: { id: string; newInfo: Record<string, any> }) => {
	const url = BASE_URL + `${id}`;
	const res = await fetch(url, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newInfo),
	});
	const body = await res.json();

	return body;
};
