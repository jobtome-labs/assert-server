import * as React from "react";

export const defaultTheme = {
  background: "#CCCCF5",
  color: "#0000CC",
} as const;

export type Theme = typeof defaultTheme;
interface ProviderProps {
  theme: Theme;
  children?: React.ReactNode;
}

const ThemeContext = React.createContext(defaultTheme);

export function ThemeProvider({ theme, ...rest }: ProviderProps) {
  return <ThemeContext.Provider value={theme} {...rest} />;
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
