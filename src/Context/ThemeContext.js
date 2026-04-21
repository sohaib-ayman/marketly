import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeContextProvider(props) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme(prev => prev === "light" ? "dark" : "light");
    }

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-bs-theme", theme);
    })

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {props.children}
        </ThemeContext.Provider>
    );
}