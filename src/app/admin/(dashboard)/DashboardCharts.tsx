"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { CheckCircle2, BarChart3 } from "lucide-react";

const PRIMARY_COLOR = "#0D726D";
const SECONDARY_COLOR = "#F6A236";
const BORDER_COLOR = "#E2E8E6";
const MUTED_BG = "#F7FAF9";
const TEXT_MUTED = "#64748b";

export function ActivityChart({ data }: { data: any[] }) {
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-foreground/40 text-sm">
        <BarChart3 size={36} className="mb-2 opacity-30 text-primary" />
        <span>Belum ada data aktivitas</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER_COLOR} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TEXT_MUTED }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TEXT_MUTED }} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: MUTED_BG }}
            contentStyle={{ borderRadius: '12px', border: `1px solid ${BORDER_COLOR}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
          />
          <Bar dataKey="kegiatan" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} name="Kegiatan" />
          <Bar dataKey="dokumen" fill={SECONDARY_COLOR} radius={[6, 6, 0, 0]} name="Dokumentasi" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusChart({ data }: { data: any[] }) {
  const COLORS = [PRIMARY_COLOR, SECONDARY_COLOR, '#3B82F6', BORDER_COLOR];
  const total = data.reduce((a, b) => a + (b.value || 0), 0);

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-foreground/40 text-sm">
        <CheckCircle2 size={36} className="mb-2 opacity-30 text-primary" />
        <span>Belum ada data program</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '12px', border: `1px solid ${BORDER_COLOR}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-foreground">
          {total}
        </span>
        <span className="text-xs text-foreground/50 font-medium">Program</span>
      </div>
    </div>
  );
}

export function ImpactChart({ data }: { data: any[] }) {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  if (!hasData) {
    return (
      <div className="h-64 w-full flex flex-col items-center justify-center text-foreground/40 text-sm">
        <BarChart3 size={36} className="mb-2 opacity-30 text-primary" />
        <span>Belum ada data kinerja & dampak</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={BORDER_COLOR} />
          <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TEXT_MUTED }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: TEXT_MUTED }} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: `1px solid ${BORDER_COLOR}`, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
          <Line type="monotone" dataKey="value" stroke={PRIMARY_COLOR} strokeWidth={3} dot={{ r: 4, fill: SECONDARY_COLOR }} activeDot={{ r: 6 }} name="Penerima Manfaat" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
