import useSWR from 'swr';
import axios from 'axios';
import { useAuth } from '@/context/auth';

const fetcher = async (url: string, token: string | null) => {
  if (!token) throw new Error('No token');
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useApi = <T,>(url: string | null) => {
  const { token } = useAuth();

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<T>>(
    url && token ? [url, token] : null,
    () => fetcher(url!, token!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data: data?.data,
    isLoading,
    error: error || data?.error,
    mutate,
    success: data?.success || false,
  };
};

export const useApiCall = () => {
  const { token } = useAuth();

  return {
    get: async <T,>(url: string) => {
      if (!token) throw new Error('Not authenticated');
      const response = await axios.get<T>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    post: async <T,>(url: string, data: any) => {
      if (!token) throw new Error('Not authenticated');
      const response = await axios.post<T>(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    put: async <T,>(url: string, data: any) => {
      if (!token) throw new Error('Not authenticated');
      const response = await axios.put<T>(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    delete: async <T,>(url: string) => {
      if (!token) throw new Error('Not authenticated');
      const response = await axios.delete<T>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  };
};
