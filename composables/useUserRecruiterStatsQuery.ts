import { useQuery } from '@tanstack/vue-query';

export const useUserRecruiterStatsQuery = (enabled: any) => {
  const fetchUserRecruiterStats = async () => {
    const response = await fetch('/api/user/recruiter-stats');
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['user-recruiter-stats'],
    queryFn: fetchUserRecruiterStats,
    enabled,
  });
};
