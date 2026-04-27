import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { CandidateListItem } from '../../../shared/types';

export function useCandidates(filters: { skill?: string; location?: string } = {}) {
  const params: Record<string, string> = {};
  if (filters.skill) params.skill = filters.skill;
  if (filters.location) params.location = filters.location;
  return useQuery<CandidateListItem[]>({
    queryKey: ['candidates', 'list', filters],
    queryFn: () => http.get(ENDPOINTS.CANDIDATES_LIST, { params }),
  });
}
