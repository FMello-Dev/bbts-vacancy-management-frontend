export type UserRole = 'REQUESTER' | 'RH';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type VacancyStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export type VacancyPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: VacancyPriority;
  status: VacancyStatus;
  createdAt: string;
  requesterId: string;
  requirements: Requirement[];
}

export type RequirementType =
  | 'SKILL'
  | 'LANGUAGE'
  | 'CERTIFICATION'
  | 'EDUCATION'
  | 'COMPANY'
  | 'LOCATION';

export interface Requirement {
  id: string;
  vacancyId: string;
  type: RequirementType;
  name: string;
  weight: number; // 1-5
  mandatory: boolean;
}

export interface ApprovalDecision {
  vacancyId: string;
  decision: 'APPROVED' | 'REJECTED';
  justification?: string;
  decidedAt: string;
}

export interface CandidateExplanation {
  metRequirements: number;
  totalRequirements: number;
  missingMandatory: string[];
  strengths: string[];
}

export interface CandidateMatch {
  candidateId: string;
  fullName: string;
  headline: string;
  location: string;
  score: number; // 0-100
  explanation: CandidateExplanation;
}