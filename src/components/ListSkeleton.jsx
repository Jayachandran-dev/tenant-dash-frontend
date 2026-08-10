import { Box, Skeleton, Stack, Paper, useMediaQuery, useTheme } from "@mui/material";

export default function ListSkeleton({ rows = 5 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Stack spacing={1.5}>
        {Array.from({ length: rows }).map((_, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton width="60%" height={22} />
            <Skeleton width="40%" height={18} sx={{ mt: 1 }} />
          </Paper>
        ))}
      </Stack>
    );
  }

  return (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ py: 1.5, borderBottom: i < rows - 1 ? "1px solid" : "none", borderColor: "divider" }}
          >
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="20%" height={24} />
            <Box sx={{ flexGrow: 1 }} />
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
          </Stack>
        ))}
      </Box>
    </Paper>
  );
}