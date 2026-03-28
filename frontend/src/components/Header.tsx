import { useContext } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { AuthContext } from "../contexts/AuthContext";
import { ColorModeContext } from "../contexts/ColorModeContext";

const Header = () => {
  const { username, logout } = useContext(AuthContext);
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <img src="/favicon.svg" alt="Gravys" height="34" style={{ display: "block" }} />
          <Typography variant="h6" fontWeight="600">
            gravys
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={theme.palette.mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Click to logout">
            <IconButton
              onClick={logout}
              color="inherit"
              sx={{ display: "flex", alignItems: "center", gap: 1, borderRadius: 2 }}
            >
              <Avatar sx={{ width: 30, height: 30, bgcolor: "primary.dark", fontSize: 14 }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2">{username}</Typography>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
