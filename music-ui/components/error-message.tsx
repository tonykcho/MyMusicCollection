'use client'

import React from "react";
import { FaY, FaCircleExclamation } from "react-icons/fa6";

interface ErrorMessageProps
{
    showErrorMessage: (message: string) => void;
    hideErrorMessage: () => void;
}

const ErrorMessageContext = React.createContext<ErrorMessageProps | undefined>(undefined);

export function useErrorMessage()
{
    const context = React.useContext(ErrorMessageContext);
    if (!context)
    {
        throw new Error("useErrorMessage must be used within an ErrorMessageProvider");
    }
    return context;
}

export function ErrorMessageProvider({ children }: { children: React.ReactNode })
{
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const showErrorMessage = (message: string) =>
    {
        setErrorMessage(message);
    };

    const hideErrorMessage = () =>
    {
        setErrorMessage(null);
    };

    // Listen to Escape key to close the message
    React.useEffect(() =>
    {
        const handleKeyDown = (e: KeyboardEvent) =>
        {
            if (e.key === 'Escape' && errorMessage)
            {
                hideErrorMessage();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () =>
        {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [errorMessage]);

    return (
        <ErrorMessageContext.Provider value={{ showErrorMessage, hideErrorMessage }}>
            {errorMessage && (
                <div className="fixed z-2000 h-full w-full top-0 left-0 flex items-center justify-center bg-gray-900/60 transition-colors duration-400" onClick={hideErrorMessage}>
                    <div onClick={(e) => e.stopPropagation()} className="text-lg flex flex-col w-120 h-60 bg-white text-black px-4 py-4 rounded-xl border border-gray-300 shadow-lg animate-[zoomIn_0.2s_ease-out_forwards]">
                        <div className="flex-1 mb-4">
                            <FaCircleExclamation size={24} className="inline mr-2 text-red-500" />
                            <p className="inline">{errorMessage}</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={hideErrorMessage} className="action-button bg-green-400 text-white hover:scale-105 hover:bg-green-500 transition-colors">
                                <FaY size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </ErrorMessageContext.Provider>
    );
}