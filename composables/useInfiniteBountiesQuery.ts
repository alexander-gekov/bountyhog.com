import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";

export const useInfiniteBountiesQuery = () => {
  const queryClient = useQueryClient();

  const fetchBounties = async ({ pageParam = 1 }) => {
    const response = await fetch(`/api/bounties?page=${pageParam}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const prefetchBounties = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["bounties", "infinite"],
      queryFn: fetchBounties,
      initialPageParam: 1,
    });
  };

  const { data, isPending, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["bounties", "infinite"],
    queryFn: fetchBounties,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage) return undefined;
      if (!lastPage.hasNextPage) return undefined;
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    prefetchBounties,
  };
};
