import { useQuery } from '@tanstack/vue-query';

export const useUserCompanyQuery = (enabled: any) => {
  const fetchUserCompany = async () => {
    const response = await fetch('/api/user/company');
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['user-company'],
    queryFn: fetchUserCompany,
    enabled,
  });
};
