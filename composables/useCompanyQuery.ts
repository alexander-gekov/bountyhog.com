import { useQuery } from '@tanstack/vue-query';

export const useCompanyQuery = (companyId: string) => {
  const fetchCompany = async () => {
    const response = await fetch(`/api/companies/${companyId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['company', companyId],
    queryFn: fetchCompany,
  });
};
