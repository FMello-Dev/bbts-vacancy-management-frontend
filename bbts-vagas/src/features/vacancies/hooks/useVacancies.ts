import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Vacancy } from '../../../shared/types';

export function useVacancies() {
  return useQuery<Vacancy[]>({
    queryKey: ['vacancies'],
    queryFn: () => http.get(ENDPOINTS.VACANCIES),
  });
}