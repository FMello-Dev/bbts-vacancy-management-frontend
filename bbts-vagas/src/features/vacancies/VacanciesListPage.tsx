import {
  Box, Card, CardContent, CardActionArea, Typography,
  Skeleton, Alert, Chip,
} from '@mui/material';
// sem import de Grid nenhum
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { useVacancies } from './hooks/useVacancies';
import { VacancyStatusChip } from './components/VacancyStatusChip';
import { AppPage } from '../../shared/components/AppPage';
import { AppButton } from '../../shared/components/AppButton';
import { useAuth } from '../auth/authContext';
import type { Vacancy } from '../../shared/types';

const PRIORITY_COLOR: Record<string, 'default' | 'info' | 'warning' | 'error'> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'error',
};

const PRIORITY_LABEL: Record<string, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        onClick={() => navigate(`/vacancies/${vacancy.id}`)}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={1.5}
            gap={1}
          >
            <Typography variant="h6" fontWeight={700} lineHeight={1.3} flex={1}>
              {vacancy.title}
            </Typography>
            <VacancyStatusChip status={vacancy.status} />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {vacancy.description}
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {vacancy.location}
              </Typography>
            </Box>
            <Chip
              label={PRIORITY_LABEL[vacancy.priority]}
              color={PRIORITY_COLOR[vacancy.priority]}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${vacancy.requirements?.length ?? 0} requisitos`}
              size="small"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function VacanciesListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: vacancies, isLoading, isError, error } = useVacancies();

  // Grid responsivo via Box + flexWrap
  const gridStyles = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 3,
    '& > *': {
      // xs: 100%, sm: ~50%, md: ~33%
      flex: '1 1 280px',
      maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
      minWidth: 280,
    },
  };

  return (
    <AppPage
      title={user?.role === 'RH' ? 'Todas as Vagas' : 'Minhas Vagas'}
      subtitle={
        user?.role === 'RH'
          ? 'Visão completa de todas as vagas da plataforma'
          : 'Vagas que você criou e solicitou'
      }
      breadcrumbs={[{ label: 'Vagas' }]}
      actions={
        user?.role === 'REQUESTER' ? (
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/vacancies/new')}
          >
            Nova Vaga
          </AppButton>
        ) : undefined
      }
    >
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message ?? 'Erro ao carregar vagas'}
        </Alert>
      )}

      {isLoading && (
        <Box sx={gridStyles}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={180} />
          ))}
        </Box>
      )}

      {!isLoading && vacancies?.length === 0 && (
        <Box textAlign="center" py={10}>
          <WorkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            Nenhuma vaga encontrada
          </Typography>
          {user?.role === 'REQUESTER' && (
            <AppButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/vacancies/new')}
              sx={{ mt: 3 }}
            >
              Criar primeira vaga
            </AppButton>
          )}
        </Box>
      )}

      {!isLoading && vacancies && vacancies.length > 0 && (
        <Box sx={gridStyles}>
          {vacancies.map((v) => (
            <VacancyCard key={v.id} vacancy={v} />
          ))}
        </Box>
      )}
    </AppPage>
  );
}