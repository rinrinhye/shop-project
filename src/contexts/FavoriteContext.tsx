import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { FavoriteMap, Product } from "../types/common";
import { useCurrentUser } from "../queries/useAuth";
import { useAuth } from "./AuthContext";
import { useModal } from "./ModalContext";
import { useNavigate } from "react-router";
import { ROUTES } from "../routes/routes";

type FavoriteContextType = {
	favoriteItems: Product[];
	toggleFavorites: (p: Product) => void;
	isFavorite: (id: number) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType | null>(null);

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const { token: _token } = useAuth();
	const { data: currentUser } = useCurrentUser();
	const { confirm } = useModal();

	// 초기 상태는 빈 객체로 설정
	const [favorites, setFavorites] = useState<FavoriteMap>({});

	// currentUser 변경 시 localStorage에서 로드 또는 초기화
	useEffect(() => {
		if (currentUser?.id) {
			const key = `like:${currentUser.id}`;
			const saved = localStorage.getItem(key);
			setFavorites(saved ? JSON.parse(saved) : {});
		} else {
			// 로그아웃 시 상태 초기화
			setFavorites({});
		}
	}, [currentUser?.id]);

	const favoriteItems = useMemo(() => Object.values(favorites), [favorites]);

	const toggleFavorites = useCallback(
		async (product: Product) => {
			if (!currentUser) {
				const ok = await confirm(
					<>
						좋아요는 로그인 후 이용할 수 있습니다.
						<br />
						로그인하고 찜한 상품을 저장해보세요!
					</>,
					{ confirmText: "이동" }
				);
				if (!ok) return;
				navigate(ROUTES.login);
				return;
			}

			const storageKey = `like:${currentUser.id}`;

			setFavorites((prev) => {
				const next = { ...prev };
				if (next[product.id]) {
					delete next[product.id];
				} else {
					next[product.id] = product;
				}

				if (Object.keys(next).length > 0) {
					localStorage.setItem(storageKey, JSON.stringify(next));
				} else {
					localStorage.removeItem(storageKey);
				}

				return next;
			});
		},
		[currentUser, confirm, navigate]
	);

	const isFavorite = useCallback((id: number) => !!favorites[id], [favorites]);

	const contextValue = useMemo(
		() => ({ favoriteItems, toggleFavorites, isFavorite }),
		[favoriteItems, toggleFavorites, isFavorite]
	);

	return <FavoriteContext.Provider value={contextValue}>{children}</FavoriteContext.Provider>;
};

export const useFavorites = () => {
	const ctx = useContext(FavoriteContext);
	if (!ctx) throw new Error("useFavorite must be used within <FavoriteProvider>");
	return ctx;
};
