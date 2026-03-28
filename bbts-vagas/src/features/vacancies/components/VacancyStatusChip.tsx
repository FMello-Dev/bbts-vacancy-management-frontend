import React from 'react';
import { Chip } from '@mui/material';
import { VacancyStatus } from '../../../shared/types';

const STATUS_CONFIG: Record<
  VacancyStatus,
  { label: string; color: 'default' | 'warning' | 'success' | 'error' | 'info' }
> = {
  DRAFT: { label: 'Rascunho', color: 'default' },
  PENDING_APPROVAL: { label: 'Aguardando Aprovação', color: 'warning' },
  APPROVED: { label: 'Aprovada', color: 'success' },
  REJECTED: { label: 'Recusada', color: 'error' },
};

export function VacancyStatusChip({ status }: { status: VacancyStatus }) {
  const { label, color } = STATUS_CONFIG[status];
  return <Chip label={label} color={color} size="small" />;
}