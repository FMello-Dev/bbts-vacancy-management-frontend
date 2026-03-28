import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AppPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function AppPage({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: AppPageProps) {
  return (
    <Box>
      {/* Header da página */}
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{ mb: 0.5 }}
            >
              {breadcrumbs.map((bc, i) =>
                bc.href ? (
                  <Link
                    key={i}
                    href={bc.href}
                    underline="hover"
                    color="text.secondary"
                    variant="body2"
                  >
                    {bc.label}
                  </Link>
                ) : (
                  <Typography key={i} variant="body2" color="text.primary">
                    {bc.label}
                  </Typography>
                )
              )}
            </Breadcrumbs>
          )}
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box display="flex" gap={1.5} flexWrap="wrap">{actions}</Box>}
      </Box>
      {children}
    </Box>
  );
}