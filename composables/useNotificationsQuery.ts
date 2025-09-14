import { useQuery } from '@tanstack/vue-query';

export const useNotificationsQuery = () => {
  const fetchNotifications = async () => {
    const response = await fetch('/api/notifications');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000, // Poll every 30 seconds
  });
};
