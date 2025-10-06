import { useQuery } from "@tanstack/vue-query";

export const useCompanyQuery = (userId: string) => {
  const fetchUser = async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  return useQuery({
    queryKey: ["user", userId],
    queryFn: fetchUser,
  });
};
