import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

function detectDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const width = window.innerWidth || 1024;
  if (coarse && width >= 768) return "tablet";
  if (coarse || width < 768) return "mobile";
  return "desktop";
}

/** Detecta el tipo de dispositivo (móvil, tableta o escritorio) y lo mantiene al día al redimensionar. */
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(detectDeviceType);
  useEffect(() => {
    const update = () => setDeviceType(detectDeviceType());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return deviceType;
}

export default useDeviceType;
