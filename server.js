const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
    path: './config.env'
});

// Configuration Variables
const PORT = process.env.PORT || 3000;
const DB = process.env.CONNECTIONSTRING
    .replace('<USERNAME>', process.env.DATABASE_USERNAME)
    .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
    .replace('<DATABASE>', process.env.DATABASE);

// Connect to MONGO ATLAS
mongoose
    .connect(DB, 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(()=> console.log('DB connection successful'));

const app = require('./app');

app.listen(PORT, ()=> {
    console.log(`App started on port: ${PORT}.`);
});