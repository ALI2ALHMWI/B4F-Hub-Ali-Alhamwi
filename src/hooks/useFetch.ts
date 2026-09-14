import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateData: Dispatch<SetStateAction<T | null>>;
}

function getErrorMessage(requestError: unknown): string {
  if (requestError instanceof Error) {
    return requestError.message;
  }

  return "Something went wrong while loading data.";
}

function useFetch<T>(fetcher: () => Promise<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    updateData: setData,
  };
}

export default useFetch;
