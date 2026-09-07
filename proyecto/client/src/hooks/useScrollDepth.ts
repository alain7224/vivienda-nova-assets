import { useEffect, useRef, useState } from "react";

/** Mide el porcentaje máximo de desplazamiento vertical alcanzado en la página (0-100). */
export function useScrollDepth(): number {
  const [depth, setDepth] = useState(0);
  const ticking = useRef(false);
  useEffect(() => {
    const measure = () => {
      ticking.current = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) { setDepth(100); return; }
      const percent = Math.round(Math.min(1, Math.max(0, window.scrollY / scrollable)) * 100);
      setDepth((current) => Math.max(current, percent));
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return depth;
}

export default useScrollDepth;
