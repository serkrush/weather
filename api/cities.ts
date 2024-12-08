import axios from 'axios';
import Config from '../config';

export const fetchCitySuggestions = async (text: string): Promise<
  { id: string; name: string; country: string }[]
> => {
  if (!text.trim()) return [];

  const url = `${Config.API_WTFGEODB_URL}?namePrefix=${text}&limit=5`;
  const options = {
    headers: {
      'x-rapidapi-key': Config.WTFGEODB_API_KEY,
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.get(url, options);
    return (
      response.data.data?.map((city: any) => ({
        id: city.id,
        name: city.name,
        country: city.countryCode,
      })) || []
    );
  } catch (error: unknown) {
    console.error('Failed to fetch city suggestions:', error);
    return [];
  }
};