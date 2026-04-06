import { useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Divider, Alert,
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { http } from '../../shared/api/http';
import { ENDPOINTS } from '../../shared/api/endpoints';
import type { User, UserRole } from '../../shared/types';
import { useAuth } from './authContext';
import { AppButton } from '../../shared/components/AppButton';

interface LoginResponse {
  token: string;
  user: User;
}

interface BackendLoginResponse {
  accessToken: string;  // já convertido pelo toCamel
  userId: number;
  name: string;
  role: string;
}

const roleToUserId: Record<string, number> = {
  REQUESTER: 1,
  RH: 2,
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const mutation = useMutation<LoginResponse, Error, { role: string }>({
    mutationFn: async (body) => {
      const res = await http.post<BackendLoginResponse>(
        ENDPOINTS.LOGIN,
        { user_id: roleToUserId[body.role] }
      );

      return {
        token: res.accessToken,
        user: {
          id: String(res.userId),       // number → string
          name: res.name,
          role: res.role as UserRole,
        },
      };
    },
    onSuccess: ({ token, user }) => login(user, token),
  });

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #0F2560 0%, #1A3A8F 60%, #1a5fa8 100%)',
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%', border: 'none', borderRadius: 4 }}>
        <CardContent sx={{ p: 5 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={4}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 1, display: 'flex' }}>
              <WorkOutlineIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="primary.main" lineHeight={1.1}>
                BBTS
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Gestão de Vagas
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" fontWeight={700} mb={0.5}>
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Selecione seu perfil de acesso para continuar
          </Typography>

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {mutation.error?.message ?? 'Erro ao autenticar'}
            </Alert>
          )}

          <Box display="flex" flexDirection="column" gap={2}>
            <AppButton
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              loading={mutation.isPending && mutation.variables?.role === 'REQUESTER'}
              startIcon={<PersonIcon />}
              onClick={() => mutation.mutate({ role: 'REQUESTER' })}
              sx={{ py: 1.5 }}
            >
              Entrar como Solicitante
            </AppButton>

            <Divider sx={{ my: 0.5 }}>
              <Typography variant="caption" color="text.secondary">ou</Typography>
            </Divider>

            <AppButton
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              loading={mutation.isPending && mutation.variables?.role === 'RH'}
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => mutation.mutate({ role: 'RH' })}
              sx={{ py: 1.5 }}
            >
              Entrar como RH
            </AppButton>
          </Box>

          <Typography
            variant="caption"
            color="text.disabled"
            display="block"
            textAlign="center"
            mt={4}
          >
            Ambiente de demonstração — credenciais simuladas
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}