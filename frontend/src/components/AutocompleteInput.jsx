import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

export default function AutocompleteInput({ id, label, placeholder, value, onChange, icon }) {
  const [suggestions, setSuggestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('/api/trains/stations');
        const data = await res.json();
        if (res.ok) {
          setSuggestions(data);
        }
      } catch (err) {
        console.error('Failed to fetch stations list:', err);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    
    if (val.trim().length === 0) {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    const matches = suggestions.filter(station => 
      station.toLowerCase().includes(val.trim().toLowerCase())
    );
    setFiltered(matches);
    setShowDropdown(true);
  };

  const selectSuggestion = (station) => {
    onChange(station);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex flex-col gap-2 w-full" ref={containerRef}>
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-textSecondary">
        {label}
      </label>
      
      <div className="relative flex items-center">
        <span className="absolute left-4 text-textSecondary pointer-events-none transition-colors">
          {icon}
        </span>
        <input 
          type="text" 
          id={id} 
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.trim().length > 0) {
              const matches = suggestions.filter(station => 
                station.toLowerCase().includes(value.trim().toLowerCase())
              );
              setFiltered(matches);
              setShowDropdown(true);
            }
          }}
          required
          className="w-full bg-[#121B31]/50 border border-borderGlass rounded-lg py-3 pl-12 pr-4 text-textPrimary text-sm outline-none transition-all duration-300 focus:border-accentCyan/40 focus:bg-[#121B31]/85 focus:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
        />
      </div>

      {showDropdown && filtered.length > 0 && (
        <div className="absolute top-[100%] left-0 w-full bg-[#0f172a] border border-borderGlass rounded-lg mt-2 max-h-52 overflow-y-auto z-50 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
          {filtered.map((station) => {
            // Basic matching bold text logic
            const matchIndex = station.toLowerCase().indexOf(value.toLowerCase());
            const before = station.substring(0, matchIndex);
            const match = station.substring(matchIndex, matchIndex + value.length);
            const after = station.substring(matchIndex + value.length);

            return (
              <div 
                key={station}
                onClick={() => selectSuggestion(station)}
                className="px-5 py-3 cursor-pointer text-sm text-textSecondary transition-all duration-200 flex items-center gap-3 hover:bg-accentCyan/10 hover:text-textPrimary"
              >
                <MapPin size={16} className="text-textSecondary" />
                <span>
                  {before}
                  <strong className="text-accentCyan font-semibold">{match}</strong>
                  {after}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
