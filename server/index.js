const express = require('express');
require('dotenv').config();

const router = require('./router');

const app = express();
const cors = require('cors');

const PORT = process.env.PORT;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`🚀 Server is running at http://localhost:${PORT} 🚀 `));
