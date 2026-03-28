import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';

interface RejectPayload {
  vacancyId: string;
  justification: string;
}

export function useRejectVacancy() {
  const qc = useQueryClient();

  return useMutation<unknown, Error, RejectPayload>({
    mutationFn: ({ vacancyId, justification }) =>
      http.post(ENDPOINTS.REJECT(vacancyId), { justification }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals'] });
      qc.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
}