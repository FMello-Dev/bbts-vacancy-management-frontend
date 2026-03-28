import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Skeleton, Alert, Chip, Box, Typography, TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { usePendingApprovals } from './hooks/usePendingApprovals';
import { useApproveVacancy } from './hooks/useApproveVacancy';
import { useRejectVacancy } from './hooks/useRejectVacancy';
import { AppPage } from '../../shared/components/AppPage';
import { AppSection } from '../../shared/components/AppSection';
import { AppButton } from '../../shared/components/AppButton';
import { AppDialog } from '../../shared/components/AppDialog';
import type { Vacancy } from '../../shared/types';

export default function ApprovalsQueuePage() {
  const navigate = useNavigate();
  const { data: pending, isLoading, isError } = usePendingApprovals();
  const { mutate: approve, isPending: isApproving } = useApproveVacancy();
  const { mutate: reject, isPending: isRejecting } = useRejectVacancy();

  const [rejectTarget, setRejectTarget] = useState<Vacancy | null>(null);
  const [justification, setJustification] = useState('');
  const [justError, setJustError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setActionId(id);
    approve(id, { onSettled: () => setActionId(null) });
  };

  const openRejectDialog = (vacancy: Vacancy) => {
    setRejectTarget(vacancy);
    setJustification('');
    setJustError('');
  };

  const handleReject = () => {
    if (!justification.trim()) {
      setJustError('Justificativa é obrigatória');
      return;
    }
    if (!rejectTarget) return;
    reject(
      { vacancyId: rejectTarget.id, justification },
      {
        onSuccess: () => {
          setRejectTarget(null);
          setJustification('');
        },
      }
    );
  };

  return (
    <AppPage
      title="Fila de Aprovação"
      subtitle="Vagas aguardando sua decisão de aprovação ou recusa"
      breadcrumbs={[{ label: 'Aprovações' }]}
    >
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar a fila de aprovação.
        </Alert>
      )}

      <AppSection noPadding>
        {isLoading ? (
          <Box p={3}>
            {[1, 2].map((i) => <Skeleton key={i} height={52} sx={{ mb: 1 }} />)}
          </Box>
        ) : !pending || pending.length === 0 ? (
          <Box textAlign="center" py={8}>
            <CheckCircleIcon sx={{ fontSize: 56, color: 'success.light', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>
              Fila vazia
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Nenhuma vaga aguardando aprovação no momento
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vaga</TableCell>
                <TableCell>Localização</TableCell>
                <TableCell>Prioridade</TableCell>
                <TableCell>Solicitada em</TableCell>
                <TableCell>Requisitos</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.map((vacancy) => (
                <TableRow key={vacancy.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {vacancy.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {vacancy.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vacancy.priority}
                      size="small"
                      color={
                        vacancy.priority === 'CRITICAL' ? 'error' :
                        vacancy.priority === 'HIGH' ? 'warning' :
                        vacancy.priority === 'MEDIUM' ? 'info' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(vacancy.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${vacancy.requirements?.length ?? 0} req.`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <AppButton
                        size="small"
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                      >
                        Ver
                      </AppButton>
                      <AppButton
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        loading={isApproving && actionId === vacancy.id}
                        onClick={() => handleApprove(vacancy.id)}
                      >
                        Aprovar
                      </AppButton>
                      <AppButton
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => openRejectDialog(vacancy)}
                      >
                        Recusar
                      </AppButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AppSection>

      {/* Dialog de recusa */}
      <AppDialog
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Recusar Vaga"
        actions={
          <>
            <AppButton variant="outlined" onClick={() => setRejectTarget(null)}>
              Cancelar
            </AppButton>
            <AppButton
              variant="contained"
              color="error"
              loading={isRejecting}
              onClick={handleReject}
            >
              Confirmar Recusa
            </AppButton>
          </>
        }
      >
        <Typography variant="body2" color="text.secondary" mb={2}>
          Você está recusando a vaga{' '}
          <strong>{rejectTarget?.title}</strong>. Informe o motivo para que
          o solicitante possa revisar e reenviar.
        </Typography>
        <TextField
          label="Justificativa"
          multiline
          rows={4}
          fullWidth
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            if (e.target.value.trim()) setJustError('');
          }}
          error={!!justError}
          helperText={justError || 'Seja específico para ajudar o solicitante'}
          placeholder="Ex: A descrição está incompleta e faltam requisitos técnicos essenciais para a triagem..."
        />
      </AppDialog>
    </AppPage>
  );
}