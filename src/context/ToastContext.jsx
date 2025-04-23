import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toast } from 'quackbox-design-system';
import { useToastContext } from './contexts';

import duck from '../assets/duck.png'

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const showToast = (message, variant) => {
        addToast({
            id: `toast-${Date.now()}`,
            message: message,
            variant: variant,
            duration: calculateToastDuration(message),
            position: 'bottom-right'
        });
    };

    const calculateToastDuration = (message) => {
        const words = message.split(' ').length;
        const readingTime = words / 4;
        const minimumDuration = 3;
        const maxDuration = 7; 
    
        let duration = Math.max(readingTime, minimumDuration); 
        duration = Math.min(duration, maxDuration);
    
        return duration * 1000;
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, showToast }}>
        {children}
        </ToastContext.Provider>
    );
};

export const ToastManager = () => {
    const { toasts, removeToast } = useToastContext();

    useEffect(() => {
        const timers = toasts.map((toast) => {
        if (toast.duration) {
            const timer = setTimeout(() => {
            removeToast(toast.id);
            }, toast.duration);

            return timer;
        }
        return null;
        });

        return () => {
        timers.forEach((timer) => clearTimeout(timer));
        };
    }, [toasts, removeToast]);

    return (
        <div>
            {toasts.length > 0 && toasts.map((toast, index) => {
                return ( 
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        variant={toast.variant}
                        duration={toast.duration}
                        iconSrc={ duck }
                        position={toast.position}
                        yOffset={`calc(${index*9}vh + var(--edge-offset))`}
                    />
                )
            })}
        </div>
    );
};
