
import { useContext } from "react";
import { GamepadContext } from "./GamepadContext";
import { NavigationContext } from "./NavigationContext";
import { PageContext } from "./PageContext";
import { ToastContext } from "./ToastContext";

export const useGamepadContext = () => useContext(GamepadContext);
export const useNavigationContext = () => useContext(NavigationContext);
export const usePageContext = () => useContext(PageContext);
export const useToastContext = () => useContext(ToastContext);
