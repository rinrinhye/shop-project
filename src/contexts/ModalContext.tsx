import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

type ModalContextType = {
  confirm: (text: string) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  const confirm = (text: string) => {
    setOpen(true);
    setText(text);
    return new Promise<boolean>((resolve) => setResolver(() => resolve));
  };

  const handleConfirm = () => {
    resolver?.(true);
    cleanup();
  };

  const handleCancel = () => {
    resolver?.(false);
    cleanup();
  };

  const cleanup = () => {
    setOpen(false);
    setText("");
    setResolver(null);
  };

  return (
    <ModalContext.Provider value={{ confirm }}>
      {children}
      {isOpen &&
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
              <div className='flex justify-end gap-2'>
                <button onClick={handleCancel}>취소</button>
                <button onClick={handleConfirm}>확인</button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
  return ctx;
};
