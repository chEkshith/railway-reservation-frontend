import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BOOKINGS_FILE = path.join(__dirname, '..', 'data', 'bookings.json');

function loadBookings() {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      const dir = path.dirname(BOOKINGS_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
}

function saveBookings(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Error saving bookings:', error);
  }
}

export const createBooking = (req, res) => {
  const { 
    username, 
    trainNumber, 
    trainName, 
    from, 
    to, 
    departure, 
    arrival, 
    duration, 
    journeyDate, 
    selectedClass, 
    passengers, 
    selectedSeats, 
    totalFare 
  } = req.body;

  if (!username || !trainNumber || !passengers || passengers.length === 0) {
    return res.status(400).json({ message: 'Missing booking details.' });
  }

  // Generate 10-digit PNR: e.g. 423-8948271
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(1000000 + Math.random() * 9000000);
  const pnr = `${part1}-${part2}`;

  const booking = {
    pnr,
    username,
    trainNumber,
    trainName,
    from,
    to,
    departure,
    arrival,
    duration,
    journeyDate,
    selectedClass,
    passengers,
    selectedSeats,
    totalFare,
    bookedAt: new Date().toISOString()
  };

  const bookings = loadBookings();
  bookings.push(booking);
  saveBookings(bookings);

  res.status(201).json({ message: 'Booking confirmed successfully.', booking });
};

export const getBookings = (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  const bookings = loadBookings();
  const userBookings = bookings.filter(b => b.username.toLowerCase() === username.trim().toLowerCase());
  
  res.status(200).json(userBookings);
};
