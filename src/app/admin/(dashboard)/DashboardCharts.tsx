"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

export function ActivityChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8E6" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip 
            cursor={{ fill: '#F7FAF9' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8E6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
          />
          <Bar dataKey="kegiatan" fill="#0D726D" radius={[6, 6, 0, 0]} name="Kegiatan" />
          <Bar dataKey="dokumen" fill="#F6A236" radius={[6, 6, 0, 0]} name="Dokumentasi" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusChart({ data }: { data: any[] }) {
  const COLORS = ['#0D726D', '#F6A236', '#3B82F6', '#E2E8E6'];

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
          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8E6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-[#172121]">
          {data.reduce((a, b) => a + b.value, 0)}
        </span>
        <span className="text-xs text-[#172121]/50 font-medium">Program</span>
      </div>
    </div>
  );
}

export function ImpactChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8E6" />
          <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8E6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
          <Line type="monotone" dataKey="value" stroke="#0D726D" strokeWidth={3} dot={{ r: 4, fill: '#F6A236' }} activeDot={{ r: 6 }} name="Penerima Manfaat" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
