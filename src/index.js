const express = require('express');
const mongoose = require('mongoose');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 4000;

app.use(cors());
app.use( express.static('public') );
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

dbConnection();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});