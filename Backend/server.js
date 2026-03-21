const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/authRoutes'));
// app.use('/api/swaps', require('./routes/swapRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/' , (req,res)=>{
    res.send("api get working");
    
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
