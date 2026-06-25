import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { ApiEvent, ClubEvent, ClubEventInput, categoryToApi, eventFromApi } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

export function useEventsQuery(category?: string) {
  const { user } = useAuth();
  const params = category ? `?category=${categoryToApi(category as any)}` : "";
  return useQuery<ClubEvent[]>({
    queryKey: ["events", { category }],
    queryFn: async () => {
      const data = await apiFetch<ApiEvent[]>(`/api/events${params}`);
      return data.map(eventFromApi);
    },
    enabled: !!user,
  });
}

export function useEventQuery(id: string) {
  const { user } = useAuth();
  return useQuery<ClubEvent>({
    queryKey: ["events", id],
    queryFn: async () => {
      const data = await apiFetch<ApiEvent>(`/api/events/${id}`);
      return eventFromApi(data);
    },
    enabled: !!user && !!id,
  });
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ClubEventInput) =>
      apiFetch<ApiEvent>("/api/events", {
        method: "POST",
        body: JSON.stringify({
          title: input.title,
          category: categoryToApi(input.category),
          date: input.date,
          time: input.time,
          location: input.location,
          capacity: input.capacity,
          description: input.description,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClubEventInput }) =>
      apiFetch<ApiEvent>(`/api/events/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: input.title,
          category: categoryToApi(input.category),
          date: input.date,
          time: input.time,
          location: input.location,
          capacity: input.capacity,
          description: input.description,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/events/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useJoinEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<unknown>(`/api/events/${id}/join`, { method: "POST" }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

export function useLeaveEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/events/${id}/join`, { method: "DELETE" }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}
