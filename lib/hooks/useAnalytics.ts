import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

export const useAnalytics = () => {
  const { getToken } = useAuth();

  const logAnalytics = async (serviceId: string, metricType: string) => {
    try {
      console.log(`Logging analytics: serviceId=${serviceId}, metricType=${metricType}`);
      const token = await getToken();
      console.log('Authentication token retrieved');
      const response = await axios.post('/api/analytics', 
        { serviceId, metricType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Analytics logged successfully', response.data);
    } catch (error) {
      console.error('Failed to log analytics', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      }
    }
  };

  const fetchAnalytics = async (timeframe = 'last_30_days') => {
    try {
      const token = await getToken();
      const response = await axios.get(`/api/analytics?timeframe=${timeframe}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.analytics ?? []; 
    } catch (error) {
      console.error('Failed to fetch analytics', error);
      return [];
    }
  };
  

  return { logAnalytics, fetchAnalytics };
};
