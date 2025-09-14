import { useQuery } from '@tanstack/vue-query';

export const useBountyQuery = (bountyId: string) => {
  const fetchBounty = async () => {
    const response = await fetch(`/api/bounties/${bountyId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['bounty', bountyId],
    queryFn: fetchBounty,
  });
};
