import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  const [searchQuery, setSearchQuery] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    travelClass: '3A',
  });
  
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [activeBooking, setActiveBooking] = useState({
    train: null,
    selectedSeats: [],
    passengers: [],
    selectedClass: '3A',
    journeyDate: '',
  });

  const [myBookings, setMyBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Modal display toggles
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Storing generated boarding ticket after successful checkout
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // Fetch past PNR listings when user changes
  useEffect(() => {
    if (user) {
      fetchUserBookings(user);
    } else {
      setMyBookings([]);
    }
  }, [user]);

  const searchTrains = async (from, to, date, travelClass) => {
    setIsSearching(true);
    setSearchQuery({ from, to, date, travelClass });
    setSearchResults([]);

    try {
      const response = await fetch(`/api/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const data = await response.json();
      
      // Simulate real-time API latency
      setTimeout(() => {
        if (response.ok) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
        setIsSearching(false);
      }, 850);
    } catch (error) {
      console.error('Error searching trains:', error);
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const fetchUserBookings = async (username) => {
    setIsLoadingBookings(true);
    try {
      const response = await fetch(`/api/bookings/user?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      if (response.ok) {
        setMyBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookingData, username: user }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setConfirmedTicket(data.booking);
        // Refresh local bookings list
        fetchUserBookings(user);
        return { success: true, booking: data.booking };
      } else {
        throw new Error(data.message || 'Booking submission failed.');
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const resetBookingFlow = () => {
    setActiveBooking({
      train: null,
      selectedSeats: [],
      passengers: [],
      selectedClass: '3A',
      journeyDate: '',
    });
    setConfirmedTicket(null);
  };

  return (
    <BookingContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      setSearchResults,
      isSearching,
      activeBooking,
      setActiveBooking,
      myBookings,
      isLoadingBookings,
      showSeatModal,
      setShowSeatModal,
      showPaymentModal,
      setShowPaymentModal,
      showTicketModal,
      setShowTicketModal,
      showAuthModal,
      setShowAuthModal,
      confirmedTicket,
      setConfirmedTicket,
      searchTrains,
      createBooking,
      fetchUserBookings,
      resetBookingFlow,
    }}>
      {children}
    </BookingContext.Provider>
  );
};
