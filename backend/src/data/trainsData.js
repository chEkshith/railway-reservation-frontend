export const stations = [
  "Noida",
  "Bengaluru",
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Chennai",
  "Secunderabad",
  "Ahmedabad",
  "Agra"
];

export const trainNames = [
  "Vande Bharat Express",
  "Rajdhani Express",
  "Shatabdi Express",
  "Duronto Express",
  "Garib Rath",
  "Superfast Deccan Queen",
  "Gatimaan Express",
  "Coromandel Express"
];

export const trainData = [];

stations.forEach((fromStation) => {
  stations.forEach((toStation) => {
    if (fromStation !== toStation) {
      for (let i = 1; i <= 3; i++) {
        const trainIndex = (stations.indexOf(fromStation) * 10 + stations.indexOf(toStation) * 3 + i) % trainNames.length;
        const trainNum = 12000 + (stations.indexOf(fromStation) * 12) + (stations.indexOf(toStation) * 5) + i;
        const departureHrs = (6 + (i * 4) + stations.indexOf(fromStation)) % 24;
        const departureMins = (i * 15) % 60;
        const durationHrs = 4 + (Math.abs(stations.indexOf(fromStation) - stations.indexOf(toStation)) * 3);
        const arrivalHrs = (departureHrs + durationHrs) % 24;
        
        const depTime = `${String(departureHrs).padStart(2, '0')}:${String(departureMins).padStart(2, '0')} ${departureHrs >= 12 ? 'PM' : 'AM'}`;
        const arrTime = `${String(arrivalHrs).padStart(2, '0')}:${String(departureMins).padStart(2, '0')} ${arrivalHrs >= 12 ? 'PM' : 'AM'}`;
        const durationStr = `${durationHrs}h 00m`;
        
        const priceBase = 450 + (durationHrs * 120);
        
        const train = {
          trainNumber: trainNum,
          trainName: `${trainNames[trainIndex]} (${trainNum})`,
          from: fromStation,
          to: toStation,
          departure: depTime,
          arrival: arrTime,
          duration: durationStr,
          classes: i === 1 ? ["1A", "2A", "CC"] : ["2A", "3A", "SL"],
          fare: priceBase,
          availability: i === 3 ? "Waiting List (WL 8)" : i === 2 ? "Booked" : "Available",
          availableSeatsCount: i === 3 ? 0 : i === 2 ? 0 : 25 + (i * 8)
        };
        trainData.push(train);
      }
    }
  });
});
