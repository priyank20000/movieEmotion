import { format } from 'date-fns';

export interface Theater {
  id: string;
  name: string;
  address: string;
  distance: number; // in kilometers
  ratings: number;
  screens: Screen[];
}

export interface Screen {
  id: string;
  name: string;
  formats: ShowFormat[];
}

export interface ShowFormat {
  type: 'standard' | '3d' | 'imax' | 'imax3d';
  price: number;
  showTimes: string[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'recliner';
  price: number;
  status: 'available' | 'taken' | 'selected';
}

// Dummy data for development
const DUMMY_THEATERS: Theater[] = [
  {
    id: '1',
    name: 'PVR Cinemas',
    address: '123 Mall Road, City Center',
    distance: 2.5,
    ratings: 4.5,
    screens: [
      {
        id: 'screen1',
        name: 'Screen 1',
        formats: [
          {
            type: 'standard',
            price: 200,
            showTimes: ['10:00', '13:00', '16:00', '19:00', '22:00']
          },
          {
            type: '3d',
            price: 300,
            showTimes: ['11:00', '14:00', '17:00', '20:00']
          },
          {
            type: 'imax',
            price: 400,
            showTimes: ['12:00', '15:00', '18:00', '21:00']
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'INOX Movies',
    address: '456 Downtown Street',
    distance: 3.8,
    ratings: 4.3,
    screens: [
      {
        id: 'screen1',
        name: 'Screen 1',
        formats: [
          {
            type: 'standard',
            price: 180,
            showTimes: ['09:30', '12:30', '15:30', '18:30', '21:30']
          },
          {
            type: '3d',
            price: 280,
            showTimes: ['10:30', '13:30', '16:30', '19:30']
          }
        ]
      }
    ]
  }
];

export const getNearbyTheaters = async (latitude: number, longitude: number): Promise<Theater[]> => {
  // In a real application, this would make an API call to get actual theaters
  // For now, return dummy data with a slight delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return DUMMY_THEATERS;
};

export const getTheaterSeats = async (
  theaterId: string,
  screenId: string,
  showTime: string
): Promise<Seat[]> => {
  // Generate a 10x10 seating layout
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seats: Seat[] = [];

  rows.forEach(row => {
    for (let i = 1; i <= 10; i++) {
      const seatType = row <= 'C' ? 'premium' : row >= 'I' ? 'recliner' : 'standard';
      const basePrice = seatType === 'premium' ? 300 : seatType === 'recliner' ? 400 : 200;
      
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type: seatType,
        price: basePrice,
        status: Math.random() > 0.3 ? 'available' : 'taken' // Randomly mark some seats as taken
      });
    }
  });

  return seats;
};