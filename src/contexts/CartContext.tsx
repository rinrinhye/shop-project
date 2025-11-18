import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem, CartMap, Product } from "../types/common";
import { useCurrentUser } from "../queries/useAuth";
import { useAuth } from "./AuthContext";
import { useModal } from "./ModalContext";
import { toast } from "sonner";

type RemoveCart = (...ids: number[]) => void;

type CartContextType = {
	cartItems: CartItem[];
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

	if (Object.keys(merged).length > 0) {
		localStorage.setItem(makeCartKey(Number(userId)), JSON.stringify(merged));
	} else {
		localStorage.removeItem(makeCartKey(Number(userId)));
	}

	localStorage.removeItem(makeCartKey(null));

	return merged;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const { token: _token } = useAuth();
	const { confirm } = useModal();

	const { data: currentUser } = useCurrentUser();

	const cartKey = makeCartKey(currentUser?.id ?? null);

	const [cartMap, setCartMap] = useState<CartMap>(() => {
		const saved = localStorage.getItem(cartKey);
		return saved ? JSON.parse(saved) : {};
	});

	const cartKeyRef = useRef<string>(cartKey);
	useEffect(() => {
		cartKeyRef.current = cartKey;
	}, [cartKey]);

	const prevUserIdRef = useRef<number | null>(currentUser?.id ?? null);

	// 6) 유저 전환 처리 (게스트↔회원)
	useEffect(() => {
		const prevId = prevUserIdRef.current;
		const nextId = currentUser?.id ?? null;
		if (prevId === nextId) return;

		const guestToUser = !prevId && !!nextId; // 게스트 → 회원
		const userToGuest = !!prevId && !nextId; // 회원 → 게스트

		if (guestToUser) {
			// 게스트 장바구니를 회원 키로 병합/이관
			const merged = mergeGuestToUserCart(String(nextId));
			setCartMap(merged);
			localStorage.setItem(makeCartKey(nextId), JSON.stringify(merged));
		}

		if (userToGuest) {
			setCartMap({});
			localStorage.removeItem(makeCartKey(prevId));
			localStorage.removeItem(makeCartKey(null));
		}

		prevUserIdRef.current = nextId;
	}, [currentUser?.id]);

	const { cartItems, totalPrice, totalCount } = useMemo(() => {
		const cartItems = Object.values(cartMap);
		const totalPrice = cartItems.reduce((acc, c) => acc + c.price * c.quantity, 0).toFixed(2);
		const totalCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
		return { cartItems, totalPrice, totalCount };
	}, [cartMap]);

	// 8) 액션들 — 최신 키는 cartKeyRef.current 사용
	const addCart = useCallback((newProduct: Product) => {
		setCartMap((prev) => {
			const exists = prev[newProduct.id];
			const next = exists
				? {
						...prev,
						[newProduct.id]: {
							...exists,
							quantity: exists.quantity + 1,
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
			const target = prev[id];
			if (!target) return prev;
			if (target.quantity === 1) return prev;

			const next = {
				...prev,
				[id]: { ...target, quantity: target.quantity - 1 },
			};

			localStorage.setItem(cartKeyRef.current, JSON.stringify(next));
			return next;
		});
	}, []);

	const removeCart: RemoveCart = useCallback(
		async (id: number) => {
			const ok = await confirm("정말 삭제하시겠습니까?");
			if (!ok) return;

			setCartMap((prev) => {
				const { [id]: _, ...rest } = prev;
				if (Object.keys(rest).length) {
					localStorage.setItem(cartKeyRef.current, JSON.stringify(rest));
				} else {
					localStorage.removeItem(cartKeyRef.current);
				}
				return rest;
			});

			toast.success("상품이 장바구니에서 삭제되었습니다.");
		},
		[confirm]
	);

	const clearCart = useCallback(async () => {
		const ok = await confirm("모두 삭제하시겠습니까?");
		if (!ok) return;

		setCartMap({});
		localStorage.removeItem(cartKeyRef.current);
		toast.success("상품이 장바구니에서 삭제되었습니다.");
	}, [confirm]);

	const removeSelectedCart = useCallback(
		async (ids: number[]) => {
			const ok = await confirm("선택한 상품을 삭제하시겠습니까?");
			if (!ok) return;

			setCartMap((prev) => {
				const filtered = Object.fromEntries(Object.entries(prev).filter(([key]) => !ids.includes(Number(key))));

				if (Object.keys(filtered).length) {
					localStorage.setItem(cartKeyRef.current, JSON.stringify(filtered));
				} else {
					localStorage.removeItem(cartKeyRef.current);
				}

				toast.success("상품이 장바구니에서 삭제되었습니다.");
				return filtered;
			});
		},
		[confirm]
	);

	const contextValue = useMemo(
		() => ({
			cartItems,
			totalPrice,
			totalCount,
			addCart,
			decreaseCart,
			removeCart,
			removeSelectedCart,
			clearCart,
		}),
		[cartItems, totalPrice, totalCount, addCart, decreaseCart, removeCart, removeSelectedCart, clearCart]
	);
	return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart must be used within <CartProvider>");
	return ctx; // ← 여기서부터는 CartContextType (null 아님)
};
