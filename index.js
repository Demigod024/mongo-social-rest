const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, () => {
    console.log('connected to MongoDB')
})

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

//test route
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server is running`)
})