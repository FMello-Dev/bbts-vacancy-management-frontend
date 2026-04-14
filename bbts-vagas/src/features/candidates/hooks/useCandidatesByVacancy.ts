import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { CandidateExplanation, CandidateMatch } from '../../../shared/types';

interface BackendCandidate {
  id: number; vacancyId: number; candidateId: number;
  fullName: string; headline: string; location: string;
  score: number; explanation: CandidateExplanation;
}

export function useCandidatesByVacancy(vacancyId: string) {
  return useQuery<CandidateMatch[]>({
    queryKey: ['candidates', vacancyId],
    queryFn: () =>
      http.get<BackendCandidate[]>(ENDPOINTS.CANDIDATES(vacancyId)).then((list) =>
        list.map((c) => ({ candidateId: String(c.candidateId), fullName: c.fullName, headline: c.headline, location: c.location, score: c.score, explanation: c.explanation }))
      ),
    enabled: !!vacancyId,
  });
}
