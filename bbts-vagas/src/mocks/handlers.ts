import { http, HttpResponse, delay } from 'msw';
import { vacancies, USERS, CANDIDATES_BY_VACANCY } from './data/seed';
import { Vacancy, Requirement } from '../shared/types';

// Helpers
function getUser(request: Request) {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.replace('Bearer ', '');
  // token format: "fake-token-{userId}"
  const userId = token.replace('fake-token-', '');
  return USERS.find((u) => u.id === userId) ?? null;
}

function makeId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const handlers = [
  // POST /auth/login
  http.post('/auth/login', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { role: string };
    const user = USERS.find((u) => u.role === body.role);
    if (!user) {
      return HttpResponse.json({ message: 'Perfil inválido' }, { status: 400 });
    }
    return HttpResponse.json({
      token: `fake-token-${user.id}`,
      user,
    });
  }),

  // GET /me
  http.get('/me', async ({ request }) => {
    await delay(200);
    const user = getUser(request);
    if (!user) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    return HttpResponse.json(user);
  }),

  // GET /vacancies
  http.get('/vacancies', async ({ request }) => {
    await delay(500);
    const user = getUser(request);
    if (!user) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });

    const filtered =
      user.role === 'RH'
        ? vacancies
        : vacancies.filter((v) => v.requesterId === user.id);

    return HttpResponse.json(filtered);
  }),

  // POST /vacancies
  http.post('/vacancies', async ({ request }) => {
    await delay(600);
    const user = getUser(request);
    if (!user) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });

    const body = (await request.json()) as Omit<
      Vacancy,
      'id' | 'status' | 'createdAt' | 'requesterId'
    > & { requirements: Omit<Requirement, 'id' | 'vacancyId'>[] };

    const id = makeId();
    const newVacancy: Vacancy = {
      id,
      title: body.title,
      description: body.description,
      location: body.location,
      priority: body.priority,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      requesterId: user.id,
      requirements: (body.requirements ?? []).map((r) => ({
        ...r,
        id: makeId(),
        vacancyId: id,
      })),
    };

    vacancies.push(newVacancy);
    return HttpResponse.json(newVacancy, { status: 201 });
  }),

  // GET /vacancies/:id
  http.get('/vacancies/:id', async ({ params, request }) => {
    await delay(300);
    const user = getUser(request);
    if (!user) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });

    const vacancy = vacancies.find((v) => v.id === params.id);
    if (!vacancy) return HttpResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });

    return HttpResponse.json(vacancy);
  }),

  // PATCH /vacancies/:id
  http.patch('/vacancies/:id', async ({ params, request }) => {
    await delay(400);
    const user = getUser(request);
    if (!user) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });

    const idx = vacancies.findIndex((v) => v.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });
    if (vacancies[idx].status !== 'DRAFT') {
      return HttpResponse.json(
        { message: 'Somente vagas em DRAFT podem ser editadas' },
        { status: 422 }
      );
    }

    const body = (await request.json()) as Partial<Vacancy>;
    vacancies[idx] = { ...vacancies[idx], ...body };
    return HttpResponse.json(vacancies[idx]);
  }),

  // POST /vacancies/:id/submit
  http.post('/vacancies/:id/submit', async ({ params, request }) => {
    await delay(500);
    const user = getUser(request);
    if (!user) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });

    const idx = vacancies.findIndex((v) => v.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });
    if (vacancies[idx].status !== 'DRAFT') {
      return HttpResponse.json(
        { message: 'Vaga não está em DRAFT' },
        { status: 422 }
      );
    }

    vacancies[idx].status = 'PENDING_APPROVAL';
    return HttpResponse.json(vacancies[idx]);
  }),

  // GET /approvals/pending
  http.get('/approvals/pending', async ({ request }) => {
    await delay(400);
    const user = getUser(request);
    if (!user || user.role !== 'RH') {
      return HttpResponse.json({ message: 'Acesso restrito ao RH' }, { status: 403 });
    }

    const pending = vacancies.filter((v) => v.status === 'PENDING_APPROVAL');
    return HttpResponse.json(pending);
  }),

  // POST /approvals/:vacancyId/approve
  http.post('/approvals/:vacancyId/approve', async ({ params, request }) => {
    await delay(600);
    const user = getUser(request);
    if (!user || user.role !== 'RH') {
      return HttpResponse.json({ message: 'Acesso restrito ao RH' }, { status: 403 });
    }

    const idx = vacancies.findIndex((v) => v.id === params.vacancyId);
    if (idx === -1) return HttpResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });

    vacancies[idx].status = 'APPROVED';
    return HttpResponse.json({
      vacancyId: params.vacancyId,
      decision: 'APPROVED',
      decidedAt: new Date().toISOString(),
    });
  }),

  // POST /approvals/:vacancyId/reject
  http.post('/approvals/:vacancyId/reject', async ({ params, request }) => {
    await delay(600);
    const user = getUser(request);
    if (!user || user.role !== 'RH') {
      return HttpResponse.json({ message: 'Acesso restrito ao RH' }, { status: 403 });
    }

    const body = (await request.json()) as { justification: string };
    if (!body.justification?.trim()) {
      return HttpResponse.json(
        { message: 'Justificativa é obrigatória para recusa' },
        { status: 422 }
      );
    }

    const idx = vacancies.findIndex((v) => v.id === params.vacancyId);
    if (idx === -1) return HttpResponse.json({ message: 'Vaga não encontrada' }, { status: 404 });

    vacancies[idx].status = 'REJECTED';
    return HttpResponse.json({
      vacancyId: params.vacancyId,
      decision: 'REJECTED',
      justification: body.justification,
      decidedAt: new Date().toISOString(),
    });
  }),

  // GET /vacancies/:id/candidates
  http.get('/vacancies/:id/candidates', async ({ params, request }) => {
    await delay(700);
    const user = getUser(request);
    if (!user) return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });

    const candidates = CANDIDATES_BY_VACANCY[params.id as string] ?? [];
    // Ordenado por score desc
    const sorted = [...candidates].sort((a, b) => b.score - a.score);
    return HttpResponse.json(sorted);
  }),
];