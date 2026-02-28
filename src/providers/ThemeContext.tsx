import { createContext, useContext, useState } from "react";
import { THEMES, type Theme, type ThemeName } from "../styles/theme";

interface ThemeContextValue {
  themeName: ThemeName;
  theme: Theme;
  setTheme: (name: ThemeName) => void;
}

const STORAGE_KEY = "theme";

function loadTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && stored in THEMES ? (stored as ThemeName) : "macchiato";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(loadTheme);

  const setTheme = (name: ThemeName) => {
    localStorage.setItem(STORAGE_KEY, name);
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider
      value={{ themeName, theme: THEMES[themeName], setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  return context;
}
