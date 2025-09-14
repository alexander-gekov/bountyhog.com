import { useQuery } from '@tanstack/vue-query';

export const useUserActivitiesQuery = (enabled: any) => {
  const fetchUserActivities = async () => {
    const response = await fetch('/api/user/activities');
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['user-activities'],
    queryFn: fetchUserActivities,
    enabled,
  });
};
