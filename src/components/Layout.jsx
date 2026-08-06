import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
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
import { useAuth } from "../context/AuthContext";
import BusinessSwitcher from "./BusinessSwitcher";
import usePermission from "../hooks/usePermission";

const drawerWidth = 260;

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const { user, currentTenant, logout } = useAuth();
  const { canManageUsers } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Business Profile", icon: <BusinessIcon />, path: "/business-profile" },
    ...(canManageUsers
      ? [{ text: "Users", icon: <PeopleIcon />, path: "/users" }]
      : []),
  ];
  // ========== DRAWER CONTENT ==========
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* User + Business Header (Clickable) */}
      <Box
        onClick={() => setSwitcherOpen(true)}
        sx={{
          p: 2.5,
          cursor: "pointer",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={user?.avatar || undefined}
            sx={{ width: 48, height: 48 }}
          >
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

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout */}
      <List>
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

  // ========== BOTTOM NAV (Mobile / PWA) ==========
  const bottomNavValue = menuItems.findIndex(
    (item) => item.path === location.pathname
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Top AppBar - Clean */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {currentTenant?.name || "Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Navigation */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
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

        {/* Desktop Drawer */}
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          mb: isMobile ? 8 : 0, // space for bottom nav
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation - Only on Mobile */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
          }}
          elevation={8}
        >
          <BottomNavigation
            showLabels
            value={bottomNavValue === -1 ? 0 : bottomNavValue}
            onChange={(e, newValue) => {
              navigate(menuItems[newValue].path);
            }}
          >
            {menuItems.map((item) => (
              <BottomNavigationAction
                key={item.text}
                label={item.text}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Business Switcher Bottom Sheet */}
      <BusinessSwitcher
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
      />
    </Box>
  );
}