import { useQuery } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { CandidateMatch } from '../../../shared/types';

interface BackendCandidate {
  id: number;
  vacancyId: number;
  fullName: string;
  headline: string;
  location: string;
  score: number;
  explanationJson: {
    metRequirements: number;
    totalRequirements: number;
    missingMandatory: string[];
    strengths: string[];
  };
}

export function useCandidatesByVacancy(vacancyId: string) {
  return useQuery<CandidateMatch[]>({
    queryKey: ['candidates', vacancyId],
    queryFn: () =>
      http.get<BackendCandidate[]>(ENDPOINTS.CANDIDATES(vacancyId)).then((list) =>
        list.map((c) => ({
          candidateId: String(c.id),
          fullName: c.fullName,
          headline: c.headline,
          location: c.location,
          score: c.score,
          explanation: c.explanationJson,
        }))
      ),
    enabled: !!vacancyId,
  });
}