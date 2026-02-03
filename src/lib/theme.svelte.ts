import { browser } from "$app/environment";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (!browser) return "light";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function createThemeState() {
  let theme = $state<Theme>(getInitialTheme());

  function applyTheme(newTheme: Theme) {
    if (!browser) return;

    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, newTheme);
  }

  // Apply initial theme
  if (browser) {
    applyTheme(theme);
  }

  return {
    get current() {
      return theme;
    },
    get isDark() {
      return theme === "dark";
    },
    toggle() {
      theme = theme === "light" ? "dark" : "light";
      applyTheme(theme);
    },
    set(newTheme: Theme) {
      theme = newTheme;
      applyTheme(theme);
    },
  };
}

export const themeState = createThemeState();
