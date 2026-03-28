import { Vacancy, CandidateMatch, User } from '../../shared/types';

export const USERS: User[] = [
  { id: 'user-1', name: 'Ana Solicitante', role: 'REQUESTER' },
  { id: 'user-rh-1', name: 'Carlos RH', role: 'RH' },
];

export let vacancies: Vacancy[] = [
  {
    id: 'vac-1',
    title: 'Desenvolvedor Backend Sênior',
    description: 'Posição para liderar squad de APIs críticas com foco em Node.js e AWS.',
    location: 'São Paulo, SP',
    priority: 'HIGH',
    status: 'DRAFT',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    requesterId: 'user-1',
    requirements: [
      {
        id: 'req-1',
        vacancyId: 'vac-1',
        type: 'SKILL',
        name: 'Node.js',
        weight: 5,
        mandatory: true,
      },
      {
        id: 'req-2',
        vacancyId: 'vac-1',
        type: 'SKILL',
        name: 'AWS',
        weight: 4,
        mandatory: true,
      },
      {
        id: 'req-3',
        vacancyId: 'vac-1',
        type: 'LANGUAGE',
        name: 'Inglês Avançado',
        weight: 3,
        mandatory: false,
      },
    ],
  },
  {
    id: 'vac-2',
    title: 'Analista de Dados Pleno',
    description: 'Extração e análise de dados com Python e SQL para área financeira.',
    location: 'Remoto',
    priority: 'MEDIUM',
    status: 'PENDING_APPROVAL',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requesterId: 'user-1',
    requirements: [
      {
        id: 'req-4',
        vacancyId: 'vac-2',
        type: 'SKILL',
        name: 'Python',
        weight: 5,
        mandatory: true,
      },
      {
        id: 'req-5',
        vacancyId: 'vac-2',
        type: 'SKILL',
        name: 'SQL',
        weight: 5,
        mandatory: true,
      },
      {
        id: 'req-6',
        vacancyId: 'vac-2',
        type: 'CERTIFICATION',
        name: 'Google Data Analytics',
        weight: 2,
        mandatory: false,
      },
    ],
  },
  {
    id: 'vac-3',
    title: 'UX Designer Sênior',
    description: 'Designer para liderar experiência dos produtos digitais da BBTS.',
    location: 'Rio de Janeiro, RJ',
    priority: 'CRITICAL',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    requesterId: 'user-1',
    requirements: [
      {
        id: 'req-7',
        vacancyId: 'vac-3',
        type: 'SKILL',
        name: 'Figma',
        weight: 5,
        mandatory: true,
      },
      {
        id: 'req-8',
        vacancyId: 'vac-3',
        type: 'SKILL',
        name: 'Design Systems',
        weight: 4,
        mandatory: true,
      },
      {
        id: 'req-9',
        vacancyId: 'vac-3',
        type: 'EDUCATION',
        name: 'Graduação em Design',
        weight: 3,
        mandatory: false,
      },
    ],
  },
];

export const CANDIDATES_BY_VACANCY: Record<string, CandidateMatch[]> = {
  'vac-3': [
    {
      candidateId: 'cand-1',
      fullName: 'Mariana Souza',
      headline: 'Senior UX Designer • Ex-Nubank • 8 anos de experiência',
      location: 'Rio de Janeiro, RJ',
      score: 96,
      explanation: {
        metRequirements: 3,
        totalRequirements: 3,
        missingMandatory: [],
        strengths: [
          'Domínio avançado em Figma com portfólio robusto',
          'Liderou criação de Design System em fintech',
          'Pós-graduação em UX pela PUC-Rio',
        ],
      },
    },
    {
      candidateId: 'cand-2',
      fullName: 'Rafael Lima',
      headline: 'Product Designer • Especialista em mobile',
      location: 'São Paulo, SP',
      score: 81,
      explanation: {
        metRequirements: 2,
        totalRequirements: 3,
        missingMandatory: [],
        strengths: [
          'Experiência sólida com Figma e prototipação',
          'Contribuiu para Design System em e-commerce de grande porte',
        ],
      },
    },
    {
      candidateId: 'cand-3',
      fullName: 'Juliana Costa',
      headline: 'UX/UI Designer • Foco em produtos B2B',
      location: 'Remoto',
      score: 74,
      explanation: {
        metRequirements: 2,
        totalRequirements: 3,
        missingMandatory: [],
        strengths: [
          'Proficiência em Figma confirmada por projetos públicos',
          'Familiaridade com tokens de design',
        ],
      },
    },
    {
      candidateId: 'cand-4',
      fullName: 'Pedro Alves',
      headline: 'UX Designer Pleno em transição para sênior',
      location: 'Rio de Janeiro, RJ',
      score: 61,
      explanation: {
        metRequirements: 1,
        totalRequirements: 3,
        missingMandatory: ['Design Systems'],
        strengths: ['Experiência com pesquisa qualitativa'],
      },
    },
    {
      candidateId: 'cand-5',
      fullName: 'Fernanda Rocha',
      headline: 'Designer Visual com transição para UX',
      location: 'Belo Horizonte, MG',
      score: 45,
      explanation: {
        metRequirements: 1,
        totalRequirements: 3,
        missingMandatory: ['Design Systems'],
        strengths: ['Conhecimentos básicos de Figma'],
      },
    },
  ],
};