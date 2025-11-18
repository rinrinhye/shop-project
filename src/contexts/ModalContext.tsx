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
import Alert from "../components/Common/Alert";
import { useScrollLock } from "../hooks/useScrollLock";

type ConfirmOptions = {
  title?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
};

type ModalContextType = {
  confirm: (
    content: React.ReactNode,
    opts?: ConfirmOptions
  ) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [opts, setOpts] = useState<ConfirmOptions>({});
  useScrollLock(isOpen);

  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  // 컴포넌트 언마운트 시 cleanup
  useEffect(() => {
    return () => {
      resolverRef.current?.(false);
      resolverRef.current = null;
      rootRef.current?.remove();
      rootRef.current = null;
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
    const resolve = resolverRef.current;
    resolverRef.current = null; // 먼저 끊어서 중복 resolve 방지
    resolve?.(false);
    setOpen(false);
    setContent(null);
    setOpts({});
    removeRoot();
  }, [removeRoot]);

  const handleConfirm = useCallback(() => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.(true);
    setOpen(false);
    setContent(null);
    setOpts({});
    removeRoot();
  }, [removeRoot]);

  // ESC 키 핸들러
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleCancel]);

  const confirm = useCallback(
    (content: React.ReactNode, options: ConfirmOptions = {}) => {
      resolverRef.current?.(false); // 기존 대기자 안전 종료
      createRoot();
      setContent(content);
      setOpts(options);
      setOpen(true);

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
          <Alert
            open={isOpen}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            title={opts.title}
            confirmText={opts.confirmText}
            cancelText={opts.cancelText}
            hideCancel={opts.hideCancel}
          >
            {content}
          </Alert>,
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
