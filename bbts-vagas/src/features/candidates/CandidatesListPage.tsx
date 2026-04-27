import { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Chip, Skeleton, Alert, Card, CardContent, CardActionArea } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from './hooks/useCandidates';
import { AppPage } from '../../shared/components/AppPage';
import { AppSection } from '../../shared/components/AppSection';

export default function CandidatesListPage() {
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');

  const { data: candidates, isLoading, isError } = useCandidates({ skill: skill || undefined, location: location || undefined });

  const search = () => { setSkill(skillInput.trim()); setLocation(locationInput.trim()); };
  const clear = () => { setSkillInput(''); setLocationInput(''); setSkill(''); setLocation(''); };

  return (
    <AppPage title="Base de Candidatos" subtitle="Todos os candidatos cadastrados na plataforma" breadcrumbs={[{ label: 'Candidatos' }]}>
      <AppSection title="Filtros">
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
          <TextField label="Skill" size="small" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} placeholder="Ex: python, react..." sx={{ minWidth: 220 }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
          <TextField label="Localização" size="small" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} placeholder="Ex: São Paulo..." sx={{ minWidth: 220 }} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon fontSize="small" /></InputAdornment> }} />
          <Box display="flex" gap={1}>
            <Chip label="Buscar" color="primary" onClick={search} clickable />
            {(skill || location) && <Chip label="Limpar" variant="outlined" onClick={clear} clickable />}
          </Box>
        </Box>
        {(skill || location) && (
          <Box display="flex" gap={1} mt={2} alignItems="center">
            <Typography variant="caption" color="text.secondary">Filtros:</Typography>
            {skill && <Chip label={`skill: ${skill}`} size="small" onDelete={() => { setSkillInput(''); setSkill(''); }} />}
            {location && <Chip label={`local: ${location}`} size="small" onDelete={() => { setLocationInput(''); setLocation(''); }} />}
          </Box>
        )}
      </AppSection>

      <AppSection noPadding>
        {isError && <Alert severity="error" sx={{ m: 3 }}>Erro ao carregar candidatos.</Alert>}
        {isLoading && <Box p={3} display="flex" flexWrap="wrap" gap={2}>{[1,2,3,4,5,6].map(i => <Skeleton key={i} variant="rounded" width={300} height={140} />)}</Box>}
        {!isLoading && candidates?.length === 0 && (
          <Box textAlign="center" py={8}>
            <PeopleIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">{skill || location ? 'Nenhum candidato com esses filtros' : 'Nenhum candidato cadastrado ainda'}</Typography>
          </Box>
        )}
        {!isLoading && candidates && candidates.length > 0 && (
          <Box p={3}>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>{candidates.length} candidato{candidates.length !== 1 ? 's' : ''}</Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {candidates.map((c) => (
                <Card key={c.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 11px)' }, minWidth: 280 }}>
                  <CardActionArea onClick={() => navigate(`/candidates/${c.id}`)}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} noWrap>{c.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap mb={1}>{c.headline}</Typography>
                      <Box display="flex" alignItems="center" gap={0.5} mb={1.5}>
                        <LocationOnIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.secondary">{c.location || 'Não informado'}</Typography>
                      </Box>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {c.skillsSummary.slice(0,4).map(s => <Chip key={s} label={s} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />)}
                        {c.skillsSummary.length > 4 && <Chip label={`+${c.skillsSummary.length - 4}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </AppSection>
    </AppPage>
  );
}
