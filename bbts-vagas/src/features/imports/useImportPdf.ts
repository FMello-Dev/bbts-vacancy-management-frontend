import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { CandidateDetail } from '../../shared/types';

const BASE = import.meta.env.VITE_API_URL ?? '';
const token = () => sessionStorage.getItem('bbts_token');

function toCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === 'object')
    return Object.fromEntries(Object.entries(obj as Record<string,unknown>).map(([k,v]) => [k.replace(/_([a-z])/g,(_,c)=>c.toUpperCase()), toCamel(v)]));
  return obj;
}

export function useImportPdf() {
  return useMutation<CandidateDetail, Error, File>({
    mutationFn: async (file) => {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch(`${BASE}${ENDPOINTS.IMPORT_PDF}`, {
        method: 'POST',
        headers: token() ? { Authorization: `Bearer ${token()}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? `HTTP ${res.status}`);
      return toCamel(data) as CandidateDetail;
    },
  });
}
