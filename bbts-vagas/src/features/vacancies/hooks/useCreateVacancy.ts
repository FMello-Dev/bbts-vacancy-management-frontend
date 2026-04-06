import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../../../shared/api/http';
import { ENDPOINTS } from '../../../shared/api/endpoints';
import { Vacancy, RequirementType } from '../../../shared/types';

// Tipo do requisito apenas para criação (sem id e vacancyId)
interface RequirementInput {
  type: RequirementType;
  name: string;
  level?: string;
  weight: number;
  mandatory: boolean;
}

interface CreateVacancyInput {
  title: string;
  description: string;
  location: string;
  priority: Vacancy['priority'];
  requirements: RequirementInput[];
}

export function useCreateVacancy() {
  const qc = useQueryClient();

  return useMutation<Vacancy, Error, CreateVacancyInput>({
    mutationFn: (data) => http.post(ENDPOINTS.VACANCIES, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
}