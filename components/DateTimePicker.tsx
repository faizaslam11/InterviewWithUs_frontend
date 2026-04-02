'use client';

/**
 * DateTimePicker.tsx — Custom styled date + time selector.
 * Replaces the ugly browser datetime-local input.
 * Shows a month calendar grid + time slots.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// Available time slots (8 AM to 10 PM, every 30 min)
const TIME_SLOTS: string[] = [];
for (let h = 8; h <= 22; h++) {
  TIME_SLOTS.push(`${h.toString().padStart(2,'0')}:00`);
  if (h < 22) TIME_SLOTS.push(`${h.toString().padStart(2,'0')}:30`);
}

interface Props {
  value: string;         // ISO string or ''
  onChange: (iso: string) => void;
  minDate?: Date;
  error?: string;
}

export function DateTimePicker({ value, onChange, minDate, error }: Props) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const base = value ? new Date(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [selectedTime, setSelectedTime] = useState<string>(
    value ? new Date(value).toTimeString().slice(0,5) : ''
  );
  const [tab, setTab] = useState<'date' | 'time'>('date');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Emit ISO string when both date and time selected
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [h, m] = selectedTime.split(':').map(Number);
      const d = new Date(selectedDate);
      d.setHours(h, m, 0, 0);
      onChange(d.toISOString());
    }
  }, [selectedDate, selectedTime]);

  const today = minDate ?? (() => { const d = new Date(); d.setHours(d.getHours() + 2); return d; })();

  // Build calendar grid
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(23, 59, 0, 0);
    return d < today;
  };

  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  const displayValue = () => {
    if (!selectedDate) return '';
    const dateStr = selectedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return selectedTime ? `${dateStr} at ${selectedTime}` : dateStr;
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-2.5 h-10 px-3.5 rounded-xl border bg-background text-sm transition-all text-left',
          open ? 'border-primary ring-2 ring-ring ring-offset-2' : 'border-input hover:border-primary/40',
          error ? 'border-destructive' : '',
        )}
      >
        <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
        <span className={displayValue() ? 'text-foreground' : 'text-muted-foreground'}>
          {displayValue() || 'Pick date and time'}
        </span>
        {selectedDate && selectedTime && (
          <span className="ml-auto text-xs text-primary font-semibold">✓</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-12 left-0 right-0 z-50 card-base shadow-xl p-4 min-w-[300px] animate-fade-up">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-secondary rounded-lg p-1">
            {(['date', 'time'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all',
                  tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t === 'date' ? <><Calendar size={12} />Date</> : <><Clock size={12} />Time</>}
                {t === 'date' && selectedDate && <span className="text-primary">✓</span>}
                {t === 'time' && selectedTime && <span className="text-primary">✓</span>}
              </button>
            ))}
          </div>

          {tab === 'date' && (
            <>
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                  className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-sm font-bold">
                  {MONTHS[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(year, month + 1, 1))}
                  className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, i) => (
                  <div key={i}>
                    {day ? (
                      <button
                        type="button"
                        disabled={isDisabled(day)}
                        onClick={() => {
                          setSelectedDate(new Date(year, month, day));
                          setTab('time');
                        }}
                        className={cn(
                          'w-full aspect-square rounded-lg text-xs font-medium transition-all',
                          isSelected(day)
                            ? 'bg-primary text-primary-foreground font-bold'
                            : isDisabled(day)
                            ? 'text-muted-foreground/30 cursor-not-allowed'
                            : 'hover:bg-secondary text-foreground',
                        )}
                      >
                        {day}
                      </button>
                    ) : <div />}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'time' && (
            <div>
              <p className="text-xs text-muted-foreground mb-3 font-medium">
                {selectedDate
                  ? `${selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}`
                  : 'Select a date first'}
              </p>
              <div className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    type="button"
                    disabled={!selectedDate}
                    onClick={() => {
                      setSelectedTime(t);
                      setOpen(false);
                    }}
                    className={cn(
                      'py-2 rounded-lg text-xs font-semibold transition-all border',
                      selectedTime === t
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary/40 hover:bg-secondary text-foreground',
                      !selectedDate && 'opacity-30 cursor-not-allowed',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
