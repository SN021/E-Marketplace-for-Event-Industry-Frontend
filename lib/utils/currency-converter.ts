import axios from 'axios';

// Caching mechanism to reduce API calls
let cachedExchangeRate: { rate: number; timestamp: number } | null = null;

export async function convertLKRtoUSD(): Promise<number> {
  // Check if we have a cached rate that's less than 1 hour old
  if (cachedExchangeRate && 
      (Date.now() - cachedExchangeRate.timestamp) < 3600000) {
    return cachedExchangeRate.rate;
  }

  try {
    // Use a free exchange rate API
    const response = await axios.get(
      'https://open.er-api.com/v6/latest/LKR',
      { timeout: 5000 }
    );

    const usdRate = response.data.rates.USD;
    
    // Cache the exchange rate
    cachedExchangeRate = {
      rate: usdRate,
      timestamp: Date.now()
    };

    return usdRate;
  } catch (error) {
    console.warn('Failed to fetch exchange rate, using fallback', error);
    // Fallback to a reasonable estimate if API fails
    return 0.0033; // Approximate rate, should be updated periodically
  }
}

export function formatCurrency(amount: number, currency: 'LKR' | 'USD' = 'LKR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export async function convertPrice(lkrAmount: number): Promise<{
  lkrAmount: number;
  usdAmount: number;
  formattedLKR: string;
  formattedUSD: string;
}> {
  const exchangeRate = await convertLKRtoUSD();
  const usdAmount = lkrAmount * exchangeRate;

  return {
    lkrAmount,
    usdAmount,
    formattedLKR: formatCurrency(lkrAmount, 'LKR'),
    formattedUSD: formatCurrency(usdAmount, 'USD')
  };
}
