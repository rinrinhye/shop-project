import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Button from "../components/ui/Button";

type ModalContextType = {
  confirm: (text: string) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState("");

  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      resolverRef.current?.(false);
      rootRef.current?.remove();
    };
  }, []);

  const createRoot = useCallback(() => {
    if (rootRef.current?.isConnected) return;

    const existing = document.getElementById("modal-root");
    if (existing) {
      rootRef.current = existing;
      return;
    }

    const root = document.createElement("div");
    root.id = "modal-root";
    root.className = "relative z-10";
    document.body.appendChild(root);
    rootRef.current = root;
  }, []);

  const removeRoot = useCallback(() => {
    rootRef.current?.remove();
    rootRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    const resolve = resolverRef.current; // 1) 현재 참조 스냅샷
    resolverRef.current = null; // 2) 먼저 끊어서 새 resolver를 보호
    resolve?.(false); // 3) 그 다음 해제
    setOpen(false);
    setText("");
    removeRoot();
  }, [removeRoot]);

  const handleConfirm = useCallback(() => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.(true);
    setOpen(false);
    setText("");
    removeRoot();
  }, [removeRoot]);

  // ESC 키 핸들러
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleCancel]);

  const confirm = useCallback(
    (text: string) => {
      resolverRef.current?.(false);

      createRoot();
      setOpen(true);
      setText(text);

      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [createRoot]
  );

  const contextValue = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {isOpen &&
        rootRef.current &&
        createPortal(
          <div
            className='bg-black/40 fixed inset-0 flex items-center justify-center'
            onClick={handleCancel}
          >
            <div
              className='bg-white rounded-2xl p-6'
              onClick={(e) => e.stopPropagation()}
            >
              <p className='mb-4'>{text}</p>
              <div className='flex gap-2'>
                <Button
                  text='취소'
                  size='md'
                  onClick={handleCancel}
                  className='grow'
                />
                <Button
                  text='확인'
                  size='md'
                  onClick={handleConfirm}
                  className='grow'
                  color='black'
                />
              </div>
            </div>
          </div>,
          rootRef.current
        )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
  return ctx;
};
