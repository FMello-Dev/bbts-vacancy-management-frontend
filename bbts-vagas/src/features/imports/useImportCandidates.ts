import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { IntegrationLog } from '../../shared/types';

const BASE = import.meta.env.VITE_API_URL ?? '';
const token = () => sessionStorage.getItem('bbts_token');
const authHeader = () => token() ? { Authorization: `Bearer ${token()}` } : {};

async function toCamel(res: Response): Promise<IntegrationLog> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? `HTTP ${res.status}`);
  const convert = (o: unknown): unknown => {
    if (Array.isArray(o)) return o.map(convert);
    if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o as Record<string,unknown>).map(([k,v]) => [k.replace(/_([a-z])/g,(_,c)=>c.toUpperCase()), convert(v)]));
    return o;
  };
  return convert(data) as IntegrationLog;
}

export function useImportCsv() {
  return useMutation<IntegrationLog, Error, File>({
    mutationFn: async (file) => {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch(`${BASE}${ENDPOINTS.IMPORT_CSV}`, { method: 'POST', headers: authHeader(), body: fd });
      return toCamel(res);
    },
  });
}

export function useImportJson() {
  return useMutation<IntegrationLog, Error, object[]>({
    mutationFn: async (records) => {
      const res = await fetch(`${BASE}${ENDPOINTS.IMPORT_JSON}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(records) });
      return toCamel(res);
    },
  });
}
