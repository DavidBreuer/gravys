import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

interface LoginProps {
  onLogin: (username: string, authHeader: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const authHeader = "Basic " + btoa(`${username}:${password}`);
    try {
      const response = await fetch("http://localhost:8000/login", {
        headers: { Authorization: authHeader },
      });
      if (response.ok) {
        onLogin(username, authHeader);
      } else {
        setError("Invalid credentials. Check your password.");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ bgcolor: "background.default" }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={3}>
          <img src="/favicon.svg" alt="" aria-hidden="true" style={{ height: 52 }} />
          <Typography variant="h4" fontWeight={600} color="primary" letterSpacing={-0.5}>
            gravys
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              inputProps={{ style: { letterSpacing: "0.25em" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? "Signing in…" : "Login"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
