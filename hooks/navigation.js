import { router, usePathname } from "expo-router";

// Hook para obtener la función segura de navegación
export const useSafeNavigation = () => {
  const pathname = usePathname();

  const safeNavigate = (path, replace = false) => {
    if (pathname === path) return; // evita duplicados
    if (replace) router.replace(path);
    else router.push(path);
  };

  return safeNavigate;
};
