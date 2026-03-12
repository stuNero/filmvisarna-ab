import { useState, useEffect } from 'react';
import fetchJson from './fetchJson';

export default function useFetchJson<Type>(url: string) {
  const [data, setData] = useState<Type | null>(null);

  useEffect(() => {
    if (url) {
      (async () => {
        setData(await fetchJson(url));
      })();
    }
  }, [url]);

  async function reloadData() {
    setData(await fetchJson(url));
  }
  return [data, reloadData] as const;
}
