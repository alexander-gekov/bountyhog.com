import { useQuery } from '@tanstack/vue-query';

export const useCompanyBountiesQuery = (enabled: any) => {
  const fetchCompanyBounties = async () => {
    const response = await fetch('/api/company/bounties');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['company-bounties'],
    queryFn: fetchCompanyBounties,
    enabled,
  });
};
