import axios from 'axios';

const LOCATION_API_KEY = "pk.d1e1f05d3b328d496c9a66eb318688eb";

export interface Location {
  city: string;
  state: string;
  country: string;
  displayName: string;
}

export const getCurrentLocation = async (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    );
  });
};

export const getLocationDetails = async (latitude: number, longitude: number): Promise<Location> => {
  try {
    const response = await axios.get(
      `https://us1.locationiq.com/v1/reverse.php?key=${LOCATION_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
    );

    return {
      city: response.data.address.city || response.data.address.town,
      state: response.data.address.state,
      country: response.data.address.country,
      displayName: response.data.display_name
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
};