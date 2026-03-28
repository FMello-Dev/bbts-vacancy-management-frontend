import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Vacancy } from '../../../shared/types';

export function useSubmitVacancy(id: string) {
  const qc = useQueryClient();

  return useMutation<Vacancy, Error>({
    mutationFn: () => http.post(ENDPOINTS.SUBMIT_VACANCY(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vacancies'] });
      qc.invalidateQueries({ queryKey: ['vacancies', id] });
    },
  });
}