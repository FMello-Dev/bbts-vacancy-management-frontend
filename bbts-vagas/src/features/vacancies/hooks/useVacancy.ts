import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Vacancy } from '../../../shared/types';

export function useVacancy(id: string) {
  return useQuery<Vacancy>({
    queryKey: ['vacancies', id],
    queryFn: () => http.get(ENDPOINTS.VACANCY(id)),
    enabled: !!id,
  });
}