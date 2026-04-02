'use client';
import * as React from 'react';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const LIMIT = 4;
const REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & { id: string; title?: React.ReactNode; description?: React.ReactNode; action?: ToastActionElement };
const actionTypes = { ADD: 'ADD', UPDATE: 'UPDATE', DISMISS: 'DISMISS', REMOVE: 'REMOVE' } as const;
type Action =
  | { type: 'ADD'; toast: ToasterToast }
  | { type: 'UPDATE'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS'; toastId?: string }
  | { type: 'REMOVE'; toastId?: string };

interface State { toasts: ToasterToast[] }
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();
let count = 0;
const genId = () => (++count % Number.MAX_SAFE_INTEGER).toString();

const queue = (id: string) => {
  if (timeouts.has(id)) return;
  timeouts.set(id, setTimeout(() => { timeouts.delete(id); dispatch({ type: 'REMOVE', toastId: id }); }, REMOVE_DELAY));
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD': return { ...state, toasts: [action.toast, ...state.toasts].slice(0, LIMIT) };
    case 'UPDATE': return { ...state, toasts: state.toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t) };
    case 'DISMISS': {
      action.toastId ? queue(action.toastId) : state.toasts.forEach(t => queue(t.id));
      return { ...state, toasts: state.toasts.map(t => (!action.toastId || t.id === action.toastId) ? { ...t, open: false } : t) };
    }
    case 'REMOVE': return { ...state, toasts: action.toastId ? state.toasts.filter(t => t.id !== action.toastId) : [] };
  }
};

const listeners: Array<(s: State) => void> = [];
let mem: State = { toasts: [] };
function dispatch(action: Action) { mem = reducer(mem, action); listeners.forEach(l => l(mem)); }

type Toast = Omit<ToasterToast, 'id'>;
function toast(props: Toast) {
  const id = genId();
  const dismiss = () => dispatch({ type: 'DISMISS', toastId: id });
  dispatch({ type: 'ADD', toast: { ...props, id, open: true, onOpenChange: open => { if (!open) dismiss(); } } });
  return { id, dismiss, update: (p: ToasterToast) => dispatch({ type: 'UPDATE', toast: { ...p, id } }) };
}

function useToast() {
  const [state, setState] = React.useState<State>(mem);
  React.useEffect(() => {
    listeners.push(setState);
    return () => { const i = listeners.indexOf(setState); if (i > -1) listeners.splice(i, 1); };
  }, []);
  return { ...state, toast, dismiss: (id?: string) => dispatch({ type: 'DISMISS', toastId: id }) };
}
export { useToast, toast };
