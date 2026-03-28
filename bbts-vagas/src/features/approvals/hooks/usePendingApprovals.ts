import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Vacancy } from '../../../shared/types';

export function usePendingApprovals() {
  return useQuery<Vacancy[]>({
    queryKey: ['approvals', 'pending'],
    queryFn: () => http.get(ENDPOINTS.APPROVALS_PENDING),
  });
}