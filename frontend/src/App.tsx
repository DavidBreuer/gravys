import { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";
import Header from "./components/Header";
import Todos from "./components/Todos";
import Login from "./components/Login";
import TodoGraph from "./components/TodoGraph";
import Neo4jNodes from "./components/Neo4jNodes";
import { AuthContext } from "./contexts/AuthContext";
import { ColorModeContext } from "./contexts/ColorModeContext";
import { RefreshContext } from "./contexts/RefreshContext";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const LS_KEY = "gravys_auth";

interface StoredAuth {
  username: string;
  authHeader: string;
}

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

function App() {
  const [mode, setMode] = useState<"light" | "dark">(
    () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const [auth, setAuth] = useState<StoredAuth | null>(readStoredAuth);
  const [todoVersion, setTodoVersion] = useState(0);
  const refreshCtx = useMemo(
    () => ({ version: todoVersion, bump: () => setTodoVersion((v) => v + 1) }),
    [todoVersion]
  );

  const handleLogin = (username: string, authHeader: string) => {
    const state = { username, authHeader };
    setAuth(state);
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem(LS_KEY);
  };

  const colorModeCtx = useMemo(
    () => ({ toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")) }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#27d644" },
        },
        components: {
          MuiButtonBase: {
            styleOverrides: {
              root: {
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
                "&:active": { boxShadow: "none" },
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                "&:focus-visible": { outline: "none", boxShadow: "none" },
                "&.Mui-focusVisible": { outline: "none", boxShadow: "none" },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#27d644",
                  borderWidth: 1,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorModeCtx}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!auth ? (
          <Login onLogin={handleLogin} />
        ) : (
          <AuthContext.Provider value={{ ...auth, logout: handleLogout }}>
            <RefreshContext.Provider value={refreshCtx}>
              <Header />
              <Todos />
              <Container maxWidth="md">
                <TodoGraph />
                <Neo4jNodes />
              </Container>
            </RefreshContext.Provider>
          </AuthContext.Provider>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
