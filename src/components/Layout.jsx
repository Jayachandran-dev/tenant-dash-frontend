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
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
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

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const { user, currentTenant, logout } = useAuth();
  const { canManageUsers } = usePermission();
  const { mode, toggleMode } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    setMoreOpen(false);
    logout();
    navigate("/login");
  };

  // Full menu (desktop drawer + More sheet)
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

  // Primary destinations only (mobile bottom nav)
  const mobileNavItems = [
    { text: "Home", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Items", icon: <InventoryIcon />, path: "/items" },
    { text: "More", icon: <MoreHorizIcon />, path: null }, // opens sheet
  ];

  const goTo = (path) => {
    if (!path) return;
    navigate(path);
    setMobileOpen(false);
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

      <List sx={{ flexGrow: 1 }}>
        {allMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => goTo(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleMode}>
            <ListItemIcon>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <ListItemText
              primary={mode === "light" ? "Dark Mode" : "Light Mode"}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // ========== MORE BOTTOM SHEET (mobile) ==========
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
        {/* Handle */}
        <Box
          sx={{
            width: 40,
            height: 5,
            bgcolor: "grey.400",
            borderRadius: 3,
            mx: "auto",
            mb: 2,
          }}
        />

        {/* Profile row → opens business switcher */}
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
            borderRadius: 2,
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

        <List>
          {allMenuItems
            .filter((item) => item.path !== "/dashboard" && item.path !== "/items")
            .map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => goTo(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={toggleMode}>
              <ListItemIcon>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </ListItemIcon>
              <ListItemText
                primary={mode === "light" ? "Dark Mode" : "Light Mode"}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
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
      </Box>
    </Drawer>
  );

  // Bottom nav active index
  const bottomNavValue = (() => {
    if (location.pathname.startsWith("/items")) return 1;
    if (
      location.pathname.startsWith("/business-profile") ||
      location.pathname.startsWith("/users") ||
      location.pathname.startsWith("/settings")
    ) {
      return 2; // highlight More when on secondary pages
    }
    return 0; // Home / Dashboard
  })();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {/* Hamburger only on mobile if you still want drawer; optional */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {currentTenant?.name || "Dashboard"}
          </Typography>

          {/* Avatar → business switcher */}
          <IconButton
            color="inherit"
            onClick={() => setSwitcherOpen(true)}
            sx={{ p: 0.5 }}
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

      {/* Side nav (desktop + optional mobile drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

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
          mt: { xs: 7, sm: 8 },
          mb: isMobile ? "calc(56px + env(safe-area-inset-bottom))" : 0,
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation – mobile only */}
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