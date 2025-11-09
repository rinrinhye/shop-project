import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const { token: _token } = useAuth();
  const { data: currentUser } = useCurrentUser();

  const [favorites, setFavorites] = useState<FavoriteMap | null>(() => {
    const items = JSON.parse(localStorage.getItem(`like:${currentUser?.id}`));
    return items ?? null;
  });

  const favoriteItems = useMemo(
    () => favorites && Object.values(favorites),
    [favorites]
  );

  const { confirm } = useModal();

  const storageKey = currentUser ? `like:${currentUser.id}` : null;

  useEffect(() => {
    if (!currentUser) return;
    const key = `like:${currentUser.id}`;
    const saved = localStorage.getItem(key);
    setFavorites(saved ? JSON.parse(saved) : {});
  }, [currentUser?.id]);

  const toggleFavorites = async (product: Product) => {
    if (!currentUser) {
      const ok = await confirm(
        "좋아요는 로그인 후 이용할 수 있습니다. 로그인하고 찜한 상품을 저장해보세요!"
      );
      if (!ok) return;
      navigate(ROUTES.login);
      return;
    }

    setFavorites((prev) => {
      const next = { ...prev };
      if (next[product.id]) delete next[product.id];
      else next[product.id] = product;

      if (storageKey) {
        if (Object.keys(next).length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } else {
          localStorage.removeItem(storageKey);
        }
      }

      return next;
    });
  };

  const isFavorite = (id: number) => !!favorites?.[id];

  const contextValue = useMemo(
    () => ({ favoriteItems, toggleFavorites, isFavorite }),
    [favoriteItems, toggleFavorites, isFavorite]
  );

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoriteContext);
  if (!ctx)
    throw new Error("useFavorite must be used within <FavoriteProvider>");
  return ctx; // ← 여기서부터는 FavoriteContextType (null 아님)
};
