import { SystemToolType } from '@/_backend/getSystemTools';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mapTypesToDeleteButtonColor: Record<SystemToolType, string> = {
  generate: 'var(--color-cyan-400)',
  action: 'var(--color-cyan-400)',
  conditional: 'var(--color-lime-400)',
  initiate: 'var(--color-emerald-500)',
  close: 'var(--color-red-400)',
};
export const typesToColors: Record<SystemToolType, string> = {
  generate: 'cyan-400',
  action: 'cyan-400',
  conditional: 'lime-400',
  initiate: 'emerald-500',
  close: 'red-400',
};
export const typesToBaseColors: Record<SystemToolType, string> = {
  generate: 'cyan',
  action: 'cyan',
  conditional: 'lime',
  initiate: 'emerald',
  close: 'red',
};
