export function isValidEmail(value: string): boolean {
	if (!value) return false;

	const email = value.trim();

	const emailRegex = /^[^\s@]+@[^\s@]+(\.[^\s@]{2,})+$/;

	return emailRegex.test(email);
}
