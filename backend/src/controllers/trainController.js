import { trainData, stations } from '../data/trainsData.js';

export const searchTrains = (req, res) => {
  const { from, to } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ message: 'From and To parameters are required.' });
  }

  const results = trainData.filter(train => 
    train.from.toLowerCase() === from.trim().toLowerCase() && 
    train.to.toLowerCase() === to.trim().toLowerCase()
  );

  res.status(200).json(results);
};

export const getStations = (req, res) => {
  res.status(200).json(stations);
};
