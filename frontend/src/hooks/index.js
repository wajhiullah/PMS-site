import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFn()
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error, setData };
}

export function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('pms_theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light-mode');
      localStorage.setItem('pms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.add('light-mode');
      localStorage.setItem('pms_theme', 'light');
    }
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return {
    dark,
    theme: dark ? 'dark' : 'light',
    toggle,
    toggleTheme: toggle,
  };
}

export function useSections() {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSections()
      .then((data) => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach((sec) => {
            let parsedExtra = null;
            if (sec.extra_json) {
              try { parsedExtra = JSON.parse(sec.extra_json); } catch (_) {}
            }
            map[sec.section_key] = { ...sec, extra: parsedExtra };
          });
          setSections(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getSection = (key, fallback = {}) => {
    return sections[key] || fallback;
  };

  return { sections, getSection, loading };
}

