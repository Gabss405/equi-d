const express = require('express');
require('dotenv').config();

const router = require('./router');

const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3015;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT} 🚀 `));
