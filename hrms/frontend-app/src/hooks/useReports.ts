import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';

export function useAttendanceSummary(from?: string, to?: string) {
  return useQuery({
    queryKey: ['attendance-summary', from, to],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      return apiGet<{ series: Array<{ day: string; count: number; late: number; overtime: number }> }>(`/api/reports/attendance-summary?${params.toString()}`);
    }
  });
}

export function useLeaveSummary() {
  return useQuery({
    queryKey: ['leave-summary'],
    queryFn: async () => apiGet<{ series: Array<{ month: string; leave_type__name: string; count: number }> }>(`/api/reports/leave-summary`)
  });
}

export function usePayrollSummary(cycleId?: string) {
  return useQuery({
    queryKey: ['payroll-summary', cycleId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (cycleId) params.set('cycleId', cycleId);
      return apiGet<{ total_gross: number; total_net: number }>(`/api/reports/payroll-summary?${params.toString()}`);
    }
  });
}

