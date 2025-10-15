'use client'

import React from "react";
import { FaN, FaY } from "react-icons/fa6";

interface MessageContextProps {
    messageBoxOpened: boolean;
    confirm: (message: string) => Promise<boolean>;
    showMessage: (message: string) => void;
    hideMessage: () => void;
}

const MessageContext = React.createContext<MessageContextProps | undefined>(undefined);

export function useMessage() {
    const context = React.useContext(MessageContext);
    if (!context) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
}


export function MessageProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = React.useState<string | null>(null);
    const resolveRef = React.useRef<(value: boolean) => void | null>(null);

    const messageBoxOpened = !!message;

    const confirm = (msg: string) => {
        setMessage(msg);
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }

    const handleYes = () => {
        if (resolveRef.current) {
            resolveRef.current(true);
            resolveRef.current = null;
        }
        hideMessage();
    }

    const handleNo = () => {
        if (resolveRef.current) {
            resolveRef.current(false);
            resolveRef.current = null;
        }
        hideMessage();
    }

    const showMessage = (msg: string) => {
        setMessage(msg);
    };

    const hideMessage = () => {
        setMessage(null);
    };

    // Listen to Escape key to close the message
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && message) {
                handleNo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [message]);

    return (
        <MessageContext.Provider value={{ messageBoxOpened, confirm, showMessage, hideMessage }}>
            {children}
            {message && (
                <div className="fixed z-2000 h-full w-full top-0 left-0 flex items-center justify-center bg-gray-900/60 transition-colors duration-400" onClick={handleNo}>
                    <div onClick={(e) => e.stopPropagation()} className="text-lg flex flex-col w-120 h-60 bg-white text-black px-4 py-4 rounded-xl border border-gray-300 shadow-lg animate-[zoomIn_0.2s_ease-out_forwards]">
                        <p className="flex-1 p-2">{message}</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleNo} className="action-button bg-red-400 text-white hover:scale-105 hover:bg-red-500 transition-colors">
                                <FaN size={20} />
                            </button>
                            <button onClick={handleYes} className="action-button bg-green-400 text-white hover:scale-105 hover:bg-green-500 transition-colors">
                                <FaY size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MessageContext.Provider>
    );
}