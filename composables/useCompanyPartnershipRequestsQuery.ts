import { useQuery } from '@tanstack/vue-query';

export const useCompanyPartnershipRequestsQuery = (enabled: any) => {
  const fetchCompanyPartnershipRequests = async () => {
    const response = await fetch('/api/company/partnership-requests');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['company-partnership-requests'],
    queryFn: fetchCompanyPartnershipRequests,
    enabled,
  });
};
