import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { CartItem, Product } from "../types/common";
import { useCurrentUser } from "../queries/useAuth";

type CartMap = Record<number, CartItem>;
type RemoveCart = (...ids: number[]) => void;

type CartContextType = {
	cartItems: (Product & { quantity: number })[];
	totalPrice: string;
	totalCount: number;
	addCart: (p: Product) => void;
	decreaseCart: (id: number) => void;
	removeCart: (id: number) => void;
	removeSelectedCart: ([...ids]: number[]) => void;
	clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const { data: currentUser } = useCurrentUser();

	const [cartMap, setCartMap] = useState<CartMap>(() => {
		const saved = currentUser ? localStorage.getItem(`cart:${currentUser.id}`) : localStorage.getItem("cart:guest");
		return saved ? JSON.parse(saved) : {};
	});

	// 이전 유저 id를 기억 → 전환(게스트↔유저) 시점 정확히 감지
	const prevUserIdRef = useRef<number | null>(currentUser?.id ?? null);

	/**
	 * [전환 감지 & 승계 + 동기화]
	 * - 게스트 → 유저 전환 시:
	 *   1) 유저 카트가 "비어 있으면" 게스트 카트를 유저 키로 승계(복사)
	 *   2) 승계 직후 setCartMap(...)으로 상태 동기화(화면 즉시 반영)
	 * - 유저 카트가 이미 있으면: 그걸로 state 동기화(게스트는 정리)
	 */

	useEffect(() => {
		const prevId = prevUserIdRef.current; // 이전 렌더의 유저 id(null=게스트)
		const currId = currentUser?.id ?? null; // 현재 렌더의 유저 id(null=게스트)

		if (prevId === currId) return; // 전환 없음 → 종료

		const guestToUser = prevId === null && currId !== null;

		if (guestToUser) {
			const userKey = `cart:${currId}`;
			const guestKey = "cart:guest";

			const guestStr = localStorage.getItem(guestKey);
			const userStr = localStorage.getItem(userKey);

			const parse = (s: string | null) => (s ? JSON.parse(s) : {});
			const guestCart = parse(guestStr);
			const userCart = parse(userStr);

			const isEmpty = (m: CartMap) => Object.keys(m).length === 0;

			if (isEmpty(userCart) && !isEmpty(guestCart)) {
				// [승계] 유저 카트가 비어있고 게스트 카트가 있으면 → 게스트 → 유저로 복사
				localStorage.setItem(userKey, guestStr!);
				localStorage.removeItem(guestKey);

				// [동기화] 승계 즉시 UI 반영
				setCartMap(guestCart);
			} else {
				// 유저 카트가 이미 있으면 그것을 사용(게스트는 정리)
				localStorage.removeItem(guestKey);
				if (!isEmpty(userCart)) setCartMap(userCart);
				else setCartMap({}); // 둘 다 비었을 때 안전하게 초기화
			}
		}

		// 전환 처리 완료 후, 이전값을 현재로 업데이트(다음 비교 대비)
		prevUserIdRef.current = currId;
	}, [currentUser]);

	/**
	 * [퍼시스트(쓰기 전용)]
	 * - cartMap 변경 시 현재 키에 저장
	 * - "빈 카트면 저장 스킵" 적용
	 * - 유저 상태라면 게스트 키 정리
	 * - 읽기/parse/setCartMap 금지(무한 루프 방지)
	 */
	useEffect(() => {
		const isEmpty = Object.keys(cartMap).length === 0;
		const userId = prevUserIdRef.current;

		if (isEmpty) return; // ⬅️ 빈 카트면 저장 스킵

		if (!userId) {
			// 게스트로 저장
			localStorage.setItem("cart:guest", JSON.stringify(cartMap));
		} else {
			// 유저로 저장 + 게스트 정리
			localStorage.setItem(`cart:${userId}`, JSON.stringify(cartMap));
			localStorage.removeItem("cart:guest");
		}
	}, [cartMap]);

	const cartItems = Object.values(cartMap);

	const totalPrice = cartItems
		.reduce((acc, curr) => {
			return acc + curr.price * curr.quantity;
		}, 0)
		.toFixed(2);

	const totalCount = cartItems.reduce((acc, curr) => {
		return acc + curr.quantity;
	}, 0);

	const addCart = useCallback((newProduct: Product) => {
		setCartMap((prev) => {
			if (!prev[newProduct.id]) {
				return {
					...prev,
					[newProduct.id]: { ...newProduct, quantity: 1 },
				};
			}

			return {
				...prev,
				[newProduct.id]: {
					...prev[newProduct.id],
					quantity: prev[newProduct.id].quantity + 1,
				},
			};
		});
	}, []);

	const decreaseCart = useCallback((id: number) => {
		setCartMap((prev) => {
			const targetProduct = prev[id];

			if (targetProduct.quantity === 1) {
				const { [id]: _, ...rest } = prev;
				return rest;
			}

			return {
				...prev,
				[id]: { ...targetProduct, quantity: targetProduct.quantity - 1 },
			};
		});
	}, []);

	const removeCart: RemoveCart = useCallback((id: number) => {
		setCartMap((prev) => {
			const { [id]: _, ...rest } = prev;
			return rest;
		});
	}, []);

	const clearCart = useCallback(() => {
		setCartMap({});
	}, []);

	const removeSelectedCart = useCallback(([...ids]) => {
		setCartMap((prev) => {
			const filteredCart = Object.fromEntries(Object.entries(prev).filter(([key]) => !ids.includes(Number(key))));

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
