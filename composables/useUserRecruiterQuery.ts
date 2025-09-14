import { useQuery } from '@tanstack/vue-query';

export const useUserRecruiterQuery = (enabled: any) => {
  const fetchUserRecruiter = async () => {
    const response = await fetch('/api/user/recruiter');
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['user-recruiter'],
    queryFn: fetchUserRecruiter,
    enabled,
  });
};
