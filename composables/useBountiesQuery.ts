import { useQuery } from "@tanstack/vue-query";

export const useBountiesQuery = () => {
  const fetchBounties = async () => {
    const response = await fetch("/api/bounties");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const bountiesQuery = useQuery({
    queryKey: ["bounties"],
    queryFn: fetchBounties,
  });

  return {
    ...bountiesQuery,
  };
};
