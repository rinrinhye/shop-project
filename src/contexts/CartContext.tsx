import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { CartItem, Product } from "../types/common";
import { useCurrentUser } from "../queries/useAuth";
import { useAuth } from "./AuthContext";
import { useModal } from "./ModalContext";
import { toast } from "sonner";

type CartMap = Record<number, CartItem>;
type RemoveCart = (...ids: number[]) => void;

type CartContextType = {
	cartItems: (Product & { quantity: number })[];
	totalPrice: string;
	totalCount: number;
	addCart: (p: Product) => void;
	decreaseCart: (id: number) => void;
	removeCart: (id: number) => void;
	removeSelectedCart: (ids: number[]) => void;
	clearCart: () => void;
};

const makeCartKey = (uid?: number | null) => (uid ? `cart:${uid}` : "cart:guest");

function mergeGuestToUserCart(userId: string | number) {
	const guest = JSON.parse(localStorage.getItem(makeCartKey(null)) || "{}");
	const user = JSON.parse(localStorage.getItem(makeCartKey(Number(userId))) || "{}");

	const merged = { ...user };
	for (const id in guest) {
		const guestItem = guest[id];
		const userItem = user[id];
		merged[id] = userItem ? { ...userItem, quantity: userItem.quantity + guestItem.quantity } : guestItem;
	}

	localStorage.setItem(makeCartKey(Number(userId)), JSON.stringify(merged));
	localStorage.removeItem(makeCartKey(null)); // cart:guest
	return merged;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const { token: _token } = useAuth();
	const { confirm } = useModal();

	const { data: currentUser } = useCurrentUser();

	const [cartMap, setCartMap] = useState<CartMap>(() => {
		const saved = localStorage.getItem(makeCartKey(currentUser?.id ?? null));
		return saved ? JSON.parse(saved) : {};
	});

	// ✅ 최신 키를 ref로 보관 (유틸 사용)
	const cartKeyRef = useRef<string>(makeCartKey(currentUser?.id ?? null));
	cartKeyRef.current = makeCartKey(currentUser?.id ?? null);

	// 이전 유저 id를 기억 → 전환(게스트↔유저) 시점 정확히 감지
	const prevUserIdRef = useRef<number | null>(null);

	useEffect(() => {
		const prevId = prevUserIdRef.current;
		const userId = currentUser?.id ?? null;

		const guestToUser = !prevId && !!userId; // 게스트 → 회원 전환
		const userToGuest = !!prevId && !userId; // 회원 → 게스트 전환

		if (guestToUser) {
			const merged = mergeGuestToUserCart(String(userId));
			setCartMap(merged);
		}

		if (userToGuest) {
			setCartMap({});
		}

		prevUserIdRef.current = userId;
	}, [currentUser?.id]);

	const cartItems = Object.values(cartMap);

	const totalPrice = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0).toFixed(2);

	const totalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

	const addCart = useCallback((newProduct: Product) => {
		setCartMap((prev) => {
			const next = prev[newProduct.id]
				? {
						...prev,
						[newProduct.id]: {
							...prev[newProduct.id],
							quantity: prev[newProduct.id].quantity + 1,
						},
				  }
				: {
						...prev,
						[newProduct.id]: { ...newProduct, quantity: 1 },
				  };

			localStorage.setItem(cartKeyRef.current, JSON.stringify(next));

			toast.success("상품을 담았어요!", { duration: 1200 });
			return next;
		});
	}, []);

	const decreaseCart = useCallback((id: number) => {
		setCartMap((prev) => {
			const targetProduct = prev[id];
			let next;

			if (targetProduct.quantity === 1) return prev;

			next = {
				...prev,
				[id]: { ...targetProduct, quantity: targetProduct.quantity - 1 },
			};

			localStorage.setItem(cartKeyRef.current, JSON.stringify(next));
			return next;
		});
	}, []);

	const removeCart: RemoveCart = useCallback(async (id: number) => {
		const ok = await confirm("정말 삭제하시겠습니까?");
		if (!ok) return;

		setCartMap((prev) => {
			const { [id]: _, ...rest } = prev;
			localStorage.setItem(cartKeyRef.current, JSON.stringify(rest));
			return rest;
		});

		toast.success("상품이 장바구니에서 삭제되었습니다.");
	}, []);

	const clearCart = useCallback(async () => {
		const ok = await confirm("모두 삭제하시겠습니까?");
		if (!ok) return;

		setCartMap({});
		localStorage.removeItem(cartKeyRef.current);

		toast.success("상품이 장바구니에서 삭제되었습니다.");
	}, []);

	const removeSelectedCart = useCallback(async (ids: number[]) => {
		const ok = await confirm("선택한 상품을 삭제하시겠습니까?");
		if (!ok) return;

		setCartMap((prev) => {
			const filteredCart = Object.fromEntries(Object.entries(prev).filter(([key]) => !ids.includes(Number(key))));
			localStorage.setItem(cartKeyRef.current, JSON.stringify(filteredCart));
			if (Object.keys(filteredCart).length === 0) localStorage.removeItem(cartKeyRef.current);

			toast.success("상품이 장바구니에서 삭제되었습니다.");
			return filteredCart;
		});
	}, []);

	return (
		<CartContext.Provider
			value={{
				cartItems,
				totalPrice,
				totalCount,
				addCart,
				decreaseCart,
				removeCart,
				removeSelectedCart,
				clearCart,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within <CartProvider>");
	return ctx; // ← 여기서부터는 CartContextType (null 아님)
};
