import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';

export function useApproveVacancy() {
  const qc = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: (vacancyId) => http.post(ENDPOINTS.APPROVE(vacancyId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals'] });
      qc.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
}