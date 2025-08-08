// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;

// Simple user database (in-memory)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user1', password: 'user123', role: 'user' },
];

// Vehicle types and vehicles (sample)
const vehicleTypes = {
  "15 pax vans": Array.from({ length: 36 }, (_, i) => `15 pax van #${i + 1}`),
  "12 pax vans": Array.from({ length: 36 }, (_, i) => `12 pax van #${i + 1}`),
  "Minivans": Array.from({ length: 36 }, (_, i) => `Minivan #${i + 1}`),
  "6 pax trucks": Array.from({ length: 36 }, (_, i) => `6 pax truck #${i + 1}`),
  "3 pax trucks": Array.from({ length: 36 }, (_, i) => `3 pax truck #${i + 1}`),
};

// Vehicle status and damage info storage (in-memory)
const vehicleData = {};
for (const type in vehicleTypes) {
  vehicleTypes[type].forEach(vehicle => {
    vehicleData[vehicle] = {
      status: 'Good',
      interiorDamage: '',
      exteriorDamage: '',
    };
  });
}

// Simple login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.json({ id: user.id, username: user.username, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get vehicle types
app.get('/vehicle-types', (req, res) => {
  res.json(Object.keys(vehicleTypes));
});

// Get vehicles by type
app.get('/vehicles/:type', (req, res) => {
  const type = req.params.type;
  if (vehicleTypes[type]) {
    res.json(vehicleTypes[type]);
  } else {
    res.status(404).json({ message: 'Vehicle type not found' });
  }
});

// Get vehicle data by vehicle name
app.get('/vehicle-data/:vehicle', (req, res) => {
  const vehicle = req.params.vehicle;
  if (vehicleData[vehicle]) {
    res.json(vehicleData[vehicle]);
  } else {
    res.status(404).json({ message: 'Vehicle not found' });
  }
});

// Update vehicle data (admin only)
app.post('/vehicle-data/:vehicle', (req, res) => {
  const { user } = req.body; // In a real app, get user info from auth token
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Admins only.' });
  }
  const vehicle = req.params.vehicle;
  if (!vehicleData[vehicle]) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  const { status, interiorDamage, exteriorDamage } = req.body;
  vehicleData[vehicle] = { status, interiorDamage, exteriorDamage };
  res.json({ message: 'Vehicle data updated' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});