import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';

interface RescoreResponse {
  message: string;
}

export function useRescoreVacancy(vacancyId: string) {
  const queryClient = useQueryClient();

  return useMutation<RescoreResponse, Error>({
    mutationFn: () =>
    http.post<RescoreResponse>(ENDPOINTS.RESCORE_VACANCY(vacancyId)),

    onSuccess: () => {
      // Invalida o cache da lista de candidatos desta vaga,
      // forçando o TanStack Query a rebuscar os dados já sem duplicatas
      queryClient.invalidateQueries({ queryKey: ['candidates', vacancyId] });
    },
  });
}