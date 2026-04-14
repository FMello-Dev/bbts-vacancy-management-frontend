export const ENDPOINTS = {
  LOGIN: '/auth/login', ME: '/auth/me',
  VACANCIES: '/vacancies',
  VACANCY: (id: string) => `/vacancies/${id}`,
  SUBMIT_VACANCY: (id: string) => `/vacancies/${id}/submit`,
  APPROVALS_PENDING: '/approvals/pending',
  APPROVE: (id: string) => `/approvals/${id}/approve`,
  REJECT: (id: string) => `/approvals/${id}/reject`,
  CANDIDATES: (vacancyId: string) => `/vacancies/${vacancyId}/candidates`,
  CANDIDATE_DETAIL: (id: string) => `/candidates/${id}`,
  IMPORT_JSON: '/candidates/import/json',
  IMPORT_CSV: '/candidates/import/csv',
  IMPORT_TEMPLATE: '/candidates/import/template',
} as const;
