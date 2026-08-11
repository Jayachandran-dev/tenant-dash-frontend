import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  Switch,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAuth } from "../context/AuthContext";
import BusinessSwitcher from "./BusinessSwitcher";
import usePermission from "../hooks/usePermission";
import { useAppTheme } from "../theme/ThemeContext";

const drawerWidth = 260;

// Map path → short title for AppBar (mobile)
const pageTitles = {
  "/dashboard": "Home",
  "/items": "Items",
  "/users": "Users",
  "/business-profile": "Business",
  "/settings": "Settings",
};

function getPageTitle(pathname) {
  const match = Object.keys(pageTitles).find((p) => pathname.startsWith(p));
  return match ? pageTitles[match] : "App";
}

export default function Layout({ children }) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const { user, currentTenant, logout } = useAuth();
  const { canManageUsers } = usePermission();
  const { mode, toggleMode } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    setMoreOpen(false);
    logout();
    navigate("/login");
  };

  const allMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Items", icon: <InventoryIcon />, path: "/items" },
    {
      text: "Business Profile",
      icon: <BusinessIcon />,
      path: "/business-profile",
    },
    ...(canManageUsers
      ? [{ text: "Users", icon: <PeopleIcon />, path: "/users" }]
      : []),
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const mobileNavItems = [
    { text: "Home", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Items", icon: <InventoryIcon />, path: "/items" },
    { text: "More", icon: <MoreHorizIcon />, path: null },
  ];

  const goTo = (path) => {
    if (!path) return;
    navigate(path);
    setMoreOpen(false);
  };

  // ========== DESKTOP DRAWER ==========
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        onClick={() => setSwitcherOpen(true)}
        sx={{
          p: 2.5,
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={user?.avatar || undefined} sx={{ width: 48, height: 48 }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography fontWeight={600} noWrap>
              {user?.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {currentTenant?.name || "Select Business"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 2.5, pt: 2, pb: 0.5, display: "block", fontWeight: 600, letterSpacing: 1 }}
      >
        Main
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {allMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ px: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => goTo(item.path)}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 2.5, pt: 2, pb: 0.5, display: "block", fontWeight: 600, letterSpacing: 1 }}
      >
        Appearance
      </Typography>

      <List>
        <ListItem disablePadding sx={{ px: 1 }}>
          <ListItemButton onClick={toggleMode} sx={{ borderRadius: 1 }}>
            <ListItemIcon>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <ListItemText primary="Dark Mode" />
            <Switch
              checked={mode === "dark"}
              onChange={toggleMode}
              onClick={(e) => e.stopPropagation()}
              size="small"
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ color: "error" }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ cursor: "pointer", color: "text.secondary", mb: 1 }}
          onClick={() => window.open("mailto:support@example.com")}
        >
          <HelpOutlineIcon fontSize="small" />
          <Typography variant="body2">Help &amp; Support</Typography>
        </Stack>
        <Typography variant="caption" color="text.disabled">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  // ========== MORE SHEET (mobile) ==========
  const moreSheet = (
    <Drawer
      anchor="bottom"
      open={moreOpen}
      onClose={() => setMoreOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: "75vh",
          pb: "env(safe-area-inset-bottom)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 5,
            bgcolor: "divider",
            borderRadius: 3,
            mx: "auto",
            mb: 2,
          }}
        />

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          onClick={() => {
            setMoreOpen(false);
            setSwitcherOpen(true);
          }}
          sx={{
            p: 1.5,
            mb: 1,
            borderRadius: 1,
            bgcolor: "action.hover",
            cursor: "pointer",
          }}
        >
          <Avatar src={user?.avatar || undefined}>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography fontWeight={600} noWrap>
              {user?.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {currentTenant?.name || "Select Business"}
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ pl: 1, pb: 0.5, display: "block", fontWeight: 600, letterSpacing: 1 }}
        >
          Main
        </Typography>

        <List>
          {allMenuItems
            .filter(
              (item) => item.path !== "/dashboard" && item.path !== "/items"
            )
            .map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => goTo(item.path)} sx={{ borderRadius: 1 }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ pl: 1, pb: 0.5, display: "block", fontWeight: 600, letterSpacing: 1 }}
        >
          Appearance
        </Typography>

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleMode} sx={{ borderRadius: 1 }}>
              <ListItemIcon>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <Switch
                checked={mode === "dark"}
                onChange={toggleMode}
                onClick={(e) => e.stopPropagation()}
                size="small"
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 1 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "error" }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ px: 1, pt: 1.5 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ cursor: "pointer", color: "text.secondary", mb: 1 }}
            onClick={() => window.open("mailto:support@example.com")}
          >
            <HelpOutlineIcon fontSize="small" />
            <Typography variant="body2">Help &amp; Support</Typography>
          </Stack>
          <Typography variant="caption" color="text.disabled">
            v1.0.0
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );

  const bottomNavValue = (() => {
    if (location.pathname.startsWith("/items")) return 1;
    if (
      location.pathname.startsWith("/business-profile") ||
      location.pathname.startsWith("/users") ||
      location.pathname.startsWith("/settings")
    ) {
      return 2;
    }
    return 0;
  })();

  // Mobile: show page title | Desktop: show business name
  const appBarTitle = isMobile
    ? getPageTitle(location.pathname)
    : currentTenant?.name || "Dashboard";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar – no hamburger on mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
            {appBarTitle}
          </Typography>

          {/* Business name chip on mobile (optional hint) */}
          {isMobile && currentTenant?.name && (
            <Typography
              variant="caption"
              sx={{
                mr: 1.5,
                opacity: 0.9,
                maxWidth: 100,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentTenant.name}
            </Typography>
          )}

          <IconButton
            color="inherit"
            onClick={() => setSwitcherOpen(true)}
            sx={{ p: 0.5 }}
            aria-label="Switch business"
          >
            <Avatar
              src={user?.avatar || undefined}
              sx={{ width: 36, height: 36 }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop side drawer only */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 }, // 56px mobile AppBar, 64px desktop
          mb: isMobile ? "calc(56px + env(safe-area-inset-bottom))" : 0,
        }}
      >
        {children}
      </Box>

      {/* Bottom nav – mobile only */}
      {isMobile && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            pb: "env(safe-area-inset-bottom)",
          }}
        >
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={(e, newValue) => {
              const item = mobileNavItems[newValue];
              if (item.path === null) {
                setMoreOpen(true);
              } else {
                goTo(item.path);
              }
            }}
          >
            {mobileNavItems.map((item) => (
              <BottomNavigationAction
                key={item.text}
                label={item.text}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {moreSheet}

      <BusinessSwitcher
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />
    </Box>
  );
}