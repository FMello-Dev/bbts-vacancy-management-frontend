import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { CandidateDetail } from '../../../shared/types';

export function useCandidateDetail(id: string) {
  return useQuery<CandidateDetail>({
    queryKey: ['candidates', id],
    queryFn: () => http.get(ENDPOINTS.CANDIDATE_DETAIL(id)),
    enabled: !!id,
  });
}
