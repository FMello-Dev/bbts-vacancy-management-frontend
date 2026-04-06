export const ENDPOINTS = {
  LOGIN: '/auth/login',
  ME: '/auth/me',
  VACANCIES: '/vacancies',
  VACANCY: (id: string) => `/vacancies/${id}`,
  SUBMIT_VACANCY: (id: string) => `/vacancies/${id}/submit`,
  APPROVALS_PENDING: '/approvals/pending',
  APPROVE: (id: string) => `/approvals/${id}/approve`,
  REJECT: (id: string) => `/approvals/${id}/reject`,
  CANDIDATES: (id: string) => `/vacancies/${id}/candidates`,
} as const;