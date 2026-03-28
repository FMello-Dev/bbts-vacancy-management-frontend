import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Vacancy } from '../../../shared/types';

export function useCreateVacancy() {
  const qc = useQueryClient();

  return useMutation<Vacancy, Error, Omit<Vacancy, 'id' | 'status' | 'createdAt' | 'requesterId'>>({
    mutationFn: (data) => http.post(ENDPOINTS.VACANCIES, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
}