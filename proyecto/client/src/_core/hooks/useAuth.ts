import { trpc } from "@/lib/trpc";

/**
 * Obtiene la sesión del visitante y centraliza el cierre de sesión.
 * El endpoint auth.me es público y devuelve null cuando no hay sesión,
 * por lo que la portada puede cargarse sin forzar un inicio de sesión.
 */
export function useAuth() {
  const utils = trpc.useUtils();
  const sessionQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  return {
    user: sessionQuery.data ?? null,
    loading: sessionQuery.isLoading,
    error: sessionQuery.error,
    isAuthenticated: Boolean(sessionQuery.data),
    logout: () => logoutMutation.mutateAsync(),
  };
}
