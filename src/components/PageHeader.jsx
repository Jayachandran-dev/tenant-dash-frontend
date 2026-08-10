import { Box, Stack, Typography, Tabs, Tab, useMediaQuery, useTheme } from "@mui/material";

/**
 * Standard page header — sticky title row with right-aligned actions,
 * plus an optional tab bar underneath. Use this on every page that needs
 * a title + action buttons (and optionally section tabs) so the pattern
 * stays identical across Business Profile, Users, Settings, etc.
 *
 * Props:
 *  - title:      page heading text
 *  - actions:    ReactNode — button/button-group rendered on the right
 *  - tabs:       optional array of { label, icon } for a tab bar
 *  - tabValue:   current tab index (required if `tabs` is passed)
 *  - onTabChange:(event, value) => void
 */
export default function PageHeader({ title, actions, tabs, tabValue, onTabChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      // Sticky header box in CommonList
      sx={{
        position: "sticky",
        top: { xs: 56, sm: 64 }, // mobile AppBar 56px, desktop 64px
        zIndex: 10,
        bgcolor: "background.default",
        pb: 2,
        pt: 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        mb={tabs ? 1 : 0}
      >
        <Typography variant="h5" fontWeight={600} noWrap sx={{ flexShrink: 1 }}>
          {title}
        </Typography>

        {/* Pushed all the way to the right, regardless of title length or wrapping */}
        {actions && (
          <Box sx={{ ml: "auto", flexShrink: 0 }}>{actions}</Box>
        )}
      </Stack>

      {tabs && (
        <Tabs
          value={tabValue}
          onChange={onTabChange}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 1,
              mr: 1,
            },
          }}
        >
          {tabs.map((t, i) => (
            <Tab
              key={t.label}
              icon={t.icon}
              iconPosition="start"
              label={t.label}
              value={i}
            />
          ))}
        </Tabs>
      )}
    </Box>
  );
}