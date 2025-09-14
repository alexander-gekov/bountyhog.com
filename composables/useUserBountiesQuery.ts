import { useQuery } from '@tanstack/vue-query';

export const useUserBountiesQuery = (enabled: any) => {
  const fetchUserBounties = async () => {
    const response = await fetch('/api/user/bounties');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['user-bounties'],
    queryFn: fetchUserBounties,
    enabled,
  });
};
