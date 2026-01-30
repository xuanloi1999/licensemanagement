import { useEffect, useState } from "react";
import type { Organization } from "../types";
import { licenseAPI } from "@/services/licenseAPI";

export function useOrganizations() {
  const [data, setData] = useState<Organization[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const orgs = await licenseAPI.getOrganizations();
        if (mounted) setData(orgs);
      } catch (err: any) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refresh: async () => {
      setLoading(true);
      try {
        const orgs = await licenseAPI.getOrganizations();
        setData(orgs);
        setError(null);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
  };
}
