import {
  Box, TextField, MenuItem, Alert, Divider,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import { AppPage } from '../../shared/components/AppPage';
import { AppSection } from '../../shared/components/AppSection';
import { AppButton } from '../../shared/components/AppButton';
import { RequirementsField } from './components/RequirementsField';
import { useCreateVacancy } from './hooks/useCreateVacancy';

const schema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  location: z.string().min(2, 'Informe a localização'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  requirements: z
    .array(
      z.object({
        type: z.enum(['SKILL', 'LANGUAGE', 'CERTIFICATION', 'EDUCATION', 'COMPANY', 'LOCATION']),
        name: z.string().min(1, 'Nome do requisito é obrigatório'),
        weight: z.number().min(1).max(5),
        mandatory: z.boolean(),
      })
    )
    .min(1, 'Adicione ao menos 1 requisito'),
});

type FormValues = z.infer<typeof schema>;

export default function VacancyCreatePage() {
  const navigate = useNavigate();
  const { mutate: createVacancy, isPending, isError, error } = useCreateVacancy();

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      priority: 'MEDIUM',
      requirements: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: FormValues) => {
    createVacancy(data, {
      onSuccess: (vacancy) => navigate(`/vacancies/${vacancy.id}`),
    });
  };

  return (
    <AppPage
      title="Nova Vaga"
      subtitle="Preencha as informações e adicione os requisitos da posição"
      breadcrumbs={[
        { label: 'Minhas Vagas', href: '/vacancies' },
        { label: 'Nova Vaga' },
      ]}
    >
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.message ?? 'Erro ao criar vaga'}
        </Alert>
      )}

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <AppSection title="Informações Gerais">
            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextField
                {...register('title')}
                label="Título da Vaga"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
                placeholder="Ex: Desenvolvedor Backend Sênior"
              />
              <TextField
                {...register('description')}
                label="Descrição"
                fullWidth
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
                placeholder="Descreva as responsabilidades, contexto e expectativas da posição..."
              />
              <Box display="flex" gap={2} flexWrap="wrap">
                <TextField
                  {...register('location')}
                  label="Localização"
                  sx={{ flex: 2, minWidth: 200 }}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  placeholder="Ex: São Paulo, SP / Remoto"
                />
                <TextField
                  {...register('priority')}
                  label="Prioridade"
                  select
                  sx={{ flex: 1, minWidth: 160 }}
                  error={!!errors.priority}
                  helperText={errors.priority?.message}
                  defaultValue="MEDIUM"
                >
                  <MenuItem value="LOW">Baixa</MenuItem>
                  <MenuItem value="MEDIUM">Média</MenuItem>
                  <MenuItem value="HIGH">Alta</MenuItem>
                  <MenuItem value="CRITICAL">Crítica</MenuItem>
                </TextField>
              </Box>
            </Box>
          </AppSection>

          <AppSection title="Requisitos da Vaga">
            <RequirementsField />
            {(errors.requirements as any)?.message && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {(errors.requirements as any).message}
              </Alert>
            )}
          </AppSection>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <AppButton
              variant="outlined"
              onClick={() => navigate('/vacancies')}
            >
              Cancelar
            </AppButton>
            <AppButton
              type="submit"
              variant="contained"
              loading={isPending}
              startIcon={<SaveIcon />}
            >
              Salvar Vaga
            </AppButton>
          </Box>
        </Box>
      </FormProvider>
    </AppPage>
  );
}