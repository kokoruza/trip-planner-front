import { useEffect, useState } from "react"

const THEME_KEY = "tp-theme"

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light")

    useEffect(() => {
        const stored = localStorage.getItem(THEME_KEY)
        if (stored === "dark" || stored === "light") {
            setTheme(stored)
            document.documentElement.dataset.theme = stored
        }
    }, [])

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light"
        setTheme(next)
        localStorage.setItem(THEME_KEY, next)
        document.documentElement.dataset.theme = next
    }

    const icon = theme === "light" ? "☀️" : "🌙"

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
        >
            {icon}
        </button>
    )
}

