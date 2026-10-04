"use client";

import { useState, useCallback, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface UseQueryOptions {
  skip?: boolean;
  refetchInterval?: number;
}

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Generic hook for fetching data
export function useQuery<T>(
  url: string,
  options?: UseQueryOptions
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (options?.skip) return;

    setLoading(true);
    try {
      const response = await axios.get<T>(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(new Error(axiosError.message));
    } finally {
      setLoading(false);
    }
  }, [url, options?.skip]);

  useEffect(() => {
    fetchData();

    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [fetchData, options?.refetchInterval]);

  return { data, loading, error, refetch: fetchData };
}

interface UseMutationResult<T, D = unknown> {
  mutate: (data: D) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Generic hook for mutations
export function useMutation<T, D = unknown>(
  url: string,
  method: "POST" | "PUT" | "DELETE" = "POST"
): UseMutationResult<T, D> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (mutationData: D) => {
      setLoading(true);
      try {
        let response;
        if (method === "DELETE") {
          response = await axios.delete<T>(url);
        } else if (method === "PUT") {
          response = await axios.put<T>(url, mutationData);
        } else {
          response = await axios.post<T>(url, mutationData);
        }
        setData(response.data);
        setError(null);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        const errorMessage = new Error(axiosError.message);
        setError(errorMessage);
        throw errorMessage;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { mutate, data, loading, error };
}

// Hook for fetching banners
export function useBanners() {
  return useQuery<any[]>("/api/banners");
}

// Hook for fetching tours
export function useTours(onlyActive = true) {
  return useQuery<any[]>(`/api/tours?active=${onlyActive}`);
}

// Hook for fetching transfers
export function useTransfers(onlyActive = true) {
  return useQuery<any[]>(`/api/transfers?active=${onlyActive}`);
}

// Hook for fetching blogs
export function useBlogs(onlyPublished = true) {
  return useQuery<any[]>(`/api/blog?published=${onlyPublished}`);
}

// Hook for fetching FAQs
export function useFAQs() {
  return useQuery<any[]>("/api/faq");
}

// Hook for fetching testimonials
export function useTestimonials() {
  return useQuery<any[]>("/api/testimonials");
}

// Hook for creating/updating items
export function useCreateItem<T>(entityType: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (data: Partial<T>) => {
      setLoading(true);
      try {
        const response = await axios.post(`/api/${entityType}`, data);
        setError(null);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        const errorMessage = new Error(axiosError.message);
        setError(errorMessage);
        throw errorMessage;
      } finally {
        setLoading(false);
      }
    },
    [entityType]
  );

  return { create, loading, error };
}

// Hook for updating items
export function useUpdateItem<T>(entityType: string, id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (data: Partial<T>) => {
      setLoading(true);
      try {
        const response = await axios.put(`/api/${entityType}/${id}`, data);
        setError(null);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        const errorMessage = new Error(axiosError.message);
        setError(errorMessage);
        throw errorMessage;
      } finally {
        setLoading(false);
      }
    },
    [entityType, id]
  );

  return { update, loading, error };
}

// Hook for deleting items
export function useDeleteItem(entityType: string, id: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteItem = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/${entityType}/${id}`);
      setError(null);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = new Error(axiosError.message);
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  }, [entityType, id]);

  return { deleteItem, loading, error };
}
