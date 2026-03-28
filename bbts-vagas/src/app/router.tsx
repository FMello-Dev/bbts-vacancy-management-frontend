import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { AppShell } from '../shared/layouts/AppShell';
import { useAuth } from '../features/auth/authContext';

// Lazy pages
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const VacanciesListPage = lazy(() => import('../features/vacancies/VacanciesListPage'));
const VacancyCreatePage = lazy(() => import('../features/vacancies/VacancyCreatePage'));
const VacancyDetailsPage = lazy(() => import('../features/vacancies/VacancyDetailsPage'));
const ApprovalsQueuePage = lazy(() => import('../features/approvals/ApprovalsQueuePage'));
const CandidatesByVacancyPage = lazy(() => import('../features/candidates/CandidatesByVacancyPage'));

function LoadingFallback() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );
}

// Guard: redireciona para /login se não autenticado
function PrivateRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

// Redireciona / conforme role
function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === 'RH'
    ? <Navigate to="/approvals" replace />
    : <Navigate to="/vacancies" replace />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <RootRedirect /> },

      // REQUESTER routes
      {
        element: <PrivateRoute allowedRoles={['REQUESTER', 'RH']} />,
        children: [
          {
            path: 'vacancies',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <VacanciesListPage />
              </Suspense>
            ),
          },
          {
            path: 'vacancies/:id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <VacancyDetailsPage />
              </Suspense>
            ),
          },
          {
            path: 'vacancies/:id/candidates',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CandidatesByVacancyPage />
              </Suspense>
            ),
          },
        ],
      },

      // REQUESTER-only
      {
        element: <PrivateRoute allowedRoles={['REQUESTER']} />,
        children: [
          {
            path: 'vacancies/new',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <VacancyCreatePage />
              </Suspense>
            ),
          },
        ],
      },

      // RH-only
      {
        element: <PrivateRoute allowedRoles={['RH']} />,
        children: [
          {
            path: 'approvals',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ApprovalsQueuePage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}