import { useQuery } from '@tanstack/vue-query';

export const useUserCompanyStatsQuery = (enabled: any) => {
  const fetchUserCompanyStats = async () => {
    const response = await fetch('/api/user/company-stats');
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['user-company-stats'],
    queryFn: fetchUserCompanyStats,
    enabled,
  });
};
