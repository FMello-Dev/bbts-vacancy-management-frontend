import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { CandidateMatch } from '../../../shared/types';

export function useCandidatesByVacancy(vacancyId: string) {
  return useQuery<CandidateMatch[]>({
    queryKey: ['candidates', vacancyId],
    queryFn: () => http.get(ENDPOINTS.CANDIDATES(vacancyId)),
    enabled: !!vacancyId,
  });
}