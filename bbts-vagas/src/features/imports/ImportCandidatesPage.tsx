import { useState, useRef } from 'react';
import { Box, Typography, Alert, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import DownloadIcon from '@mui/icons-material/Download';
import { AppPage } from '../../shared/components/AppPage';
import { AppSection } from '../../shared/components/AppSection';
import { AppButton } from '../../shared/components/AppButton';
import { useImportCsv, useImportJson } from './useImportCandidates';
import type { IntegrationLog } from '../../shared/types';
import { ENDPOINTS } from '../../shared/api/endpoints';

function StatusChip({ status }: { status: string }) {
  if (status === 'SUCCESS') return <Chip icon={<CheckCircleIcon />} label="Sucesso" color="success" size="small" />;
  if (status === 'PARTIAL') return <Chip icon={<WarningIcon />} label="Parcial" color="warning" size="small" />;
  return <Chip icon={<ErrorIcon />} label="Falhou" color="error" size="small" />;
}

function ResultCard({ log }: { log: IntegrationLog }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <StatusChip status={log.status} />
        <Typography variant="subtitle2" fontWeight={700}>Resultado da importação</Typography>
        {log.filename && <Typography variant="caption" color="text.secondary">{log.filename}</Typography>}
      </Box>
      <Box display="flex" gap={4} mb={2}>
        {[['Total', log.totalRecords, 'text.primary'], ['Importados', log.successCount, 'success.main'], ['Erros', log.errorCount, 'error.main']].map(([label, val, color]) => (
          <Box key={label as string} textAlign="center">
            <Typography variant="h4" fontWeight={800} color={color as string}>{val as number}</Typography>
            <Typography variant="caption" color="text.secondary">{label as string}</Typography>
          </Box>
        ))}
      </Box>
      {log.errorsJson && log.errorsJson.length > 0 && (
        <Table size="small"><TableHead><TableRow><TableCell>Linha</TableCell><TableCell>Erro</TableCell></TableRow></TableHead>
          <TableBody>{log.errorsJson.map((e, i) => <TableRow key={i}><TableCell>{e.row}</TableCell><TableCell>{e.message}</TableCell></TableRow>)}</TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default function ImportCandidatesPage() {
  const [tab, setTab] = useState(0);
  const [result, setResult] = useState<IntegrationLog | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate: importCsv, isPending: csvLoading } = useImportCsv();
  const { mutate: importJson, isPending: jsonLoading } = useImportJson();

  return (
    <AppPage title="Importar Candidatos" subtitle="Adicione candidatos à base via CSV ou JSON"
      breadcrumbs={[{ label: 'Importar Candidatos' }]}
      actions={<AppButton variant="outlined" startIcon={<DownloadIcon />} onClick={async () => {
  const token = sessionStorage.getItem('bbts_token');
  const res = await fetch(`${import.meta.env.VITE_API_URL}${ENDPOINTS.IMPORT_TEMPLATE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'candidatos_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}}>Baixar Template CSV</AppButton>}>
      <AppSection>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setResult(null); }} sx={{ mb: 3 }}>
          <Tab label="CSV" /><Tab label="JSON" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Box sx={{ border: '2px dashed', borderColor: csvFile ? 'primary.main' : 'divider', borderRadius: 3, p: 4, textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }} onClick={() => fileRef.current?.click()}>
              <UploadFileIcon sx={{ fontSize: 48, color: csvFile ? 'primary.main' : 'text.disabled', mb: 1 }} />
              <Typography variant="body1" fontWeight={600}>{csvFile ? csvFile.name : 'Clique para selecionar o CSV'}</Typography>
              <Typography variant="caption" color="text.secondary">{csvFile ? `${(csvFile.size/1024).toFixed(1)} KB` : 'Formato: .csv'}</Typography>
              <input ref={fileRef} type="file" accept=".csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCsvFile(f); setResult(null); } }} />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <AppButton variant="contained" loading={csvLoading} disabled={!csvFile} startIcon={<UploadFileIcon />}
                onClick={() => csvFile && importCsv(csvFile, { onSuccess: (l) => { setResult(l); setCsvFile(null); }, onError: (e) => alert(e.message) })}>
                Importar CSV
              </AppButton>
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Box component="textarea" value={jsonText} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setJsonText(e.target.value); setJsonError(''); }}
              placeholder={'[\n  {\n    "full_name": "João Silva",\n    "email": "joao@email.com",\n    "location": "São Paulo, SP",\n    "skills": [{ "name": "Python", "level": "Avançado", "years_experience": 5 }],\n    "languages": [{ "name": "Inglês", "level": "B2" }],\n    "certifications": [], "educations": [], "experiences": []\n  }\n]'}
              sx={{ width: '100%', minHeight: 260, p: 2, fontFamily: 'monospace', fontSize: '0.8rem', border: '1px solid', borderColor: jsonError ? 'error.main' : 'divider', borderRadius: 2, resize: 'vertical', outline: 'none', bgcolor: 'background.paper', color: 'text.primary', '&:focus': { borderColor: 'primary.main' } }} />
            {jsonError && <Alert severity="error" sx={{ mt: 1 }}>{jsonError}</Alert>}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <AppButton variant="contained" loading={jsonLoading} disabled={!jsonText.trim()} startIcon={<UploadFileIcon />}
                onClick={() => { try { const p = JSON.parse(jsonText); if (!Array.isArray(p)) { setJsonError('JSON deve ser um array'); return; } importJson(p, { onSuccess: (l) => { setResult(l); setJsonText(''); }, onError: (e) => setJsonError(e.message) }); } catch { setJsonError('JSON inválido'); } }}>
                Importar JSON
              </AppButton>
            </Box>
          </Box>
        )}
      </AppSection>

      {result && <ResultCard log={result} />}

      <AppSection title="Formato CSV">
        <Typography variant="body2" color="text.secondary" mb={1}>Campos compostos usam <code>;</code> para itens e <code>:</code> para sub-campos.</Typography>
        <Box component="pre" sx={{ bgcolor: 'grey.900', color: 'grey.100', p: 2, borderRadius: 2, fontSize: '0.72rem', overflowX: 'auto' }}>
{`full_name,email,location,skills,languages,certifications,education,experiences
João Silva,joao@email.com,São Paulo SP,Python:Avançado:5;FastAPI:Inter:2,Inglês:B2,AWS:Amazon:2023,USP:CC:Bach:2018,BBTS:Dev:2022:2024:false`}
        </Box>
      </AppSection>
    </AppPage>
  );
}
