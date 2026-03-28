import {
  Box, Typography, IconButton, MenuItem, Select,
  TextField, Switch, FormControlLabel, Divider, Button, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import type { RequirementType } from '../../../shared/types';

const REQUIREMENT_TYPES: { value: RequirementType; label: string }[] = [
  { value: 'SKILL', label: 'Habilidade Técnica' },
  { value: 'LANGUAGE', label: 'Idioma' },
  { value: 'CERTIFICATION', label: 'Certificação' },
  { value: 'EDUCATION', label: 'Formação Acadêmica' },
  { value: 'COMPANY', label: 'Empresa Anterior' },
  { value: 'LOCATION', label: 'Localização' },
];

export function RequirementsField() {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'requirements',
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Requisitos
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() =>
            append({ type: 'SKILL', name: '', weight: 3, mandatory: false })
          }
        >
          Adicionar
        </Button>
      </Box>

      {(errors.requirements as any)?.root && (
        <Typography variant="caption" color="error" display="block" mb={1}>
          {(errors.requirements as any).root.message}
        </Typography>
      )}

      {fields.length === 0 && (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Nenhum requisito adicionado. Clique em "Adicionar" para começar.
          </Typography>
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              p: 2.5,
              position: 'relative',
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Chip
                label={`Requisito ${index + 1}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => remove(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap">
              {/* Tipo */}
              <Box flex="1" minWidth={160}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.5}>
                  Tipo
                </Typography>
                <Controller
                  name={`requirements.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select {...field} size="small" fullWidth>
                      {REQUIREMENT_TYPES.map((t) => (
                        <MenuItem key={t.value} value={t.value}>
                          {t.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Box>

              {/* Nome */}
              <Box flex="2" minWidth={200}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.5}>
                  Descrição
                </Typography>
                <TextField
                  {...register(`requirements.${index}.name`)}
                  size="small"
                  fullWidth
                  placeholder="Ex: Node.js, Inglês fluente..."
                  error={!!(errors.requirements as any)?.[index]?.name}
                  helperText={(errors.requirements as any)?.[index]?.name?.message}
                />
              </Box>

              {/* Peso */}
              <Box width={100}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.5}>
                  Peso (1–5)
                </Typography>
                <TextField
                  {...register(`requirements.${index}.weight`, { valueAsNumber: true })}
                  size="small"
                  type="number"
                  inputProps={{ min: 1, max: 5 }}
                  fullWidth
                  error={!!(errors.requirements as any)?.[index]?.weight}
                />
              </Box>

              {/* Obrigatório */}
              <Box display="flex" alignItems="flex-end" pb={0.5}>
                <Controller
                  name={`requirements.${index}.mandatory`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="caption" fontWeight={600}>
                          Obrigatório
                        </Typography>
                      }
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}