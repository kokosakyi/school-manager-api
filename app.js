const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const AppError = require('./util/appError');


// LOAD IN ROUTES
const userRouter = require('./routes/userRoutes');
const studentRouter = require('./routes/studentRoutes');
const authRouter = require('./routes/authRoutes');
const guardianRouter = require('./routes/guardianRoutes');
const classGroupRouter = require('./routes/classGroupRoutes');
const classRouter = require('./routes/classRoutes');
const subjectRouter = require('./routes/subjectRoutes');

// MIDDLEWARE

// Cors
app.use(cors());

// Helmet
app.use(helmet());

// Compression
app.use(compression());

// Express File Upload
app.use(fileUpload());

// Body Parser
app.use(express.urlencoded({
    extended: false
}));

app.use(express.json({
    limit: '10kb'
}));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/guardians', guardianRouter);
app.use('/api/v1/class-groups', classGroupRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/classes', classRouter);


// Handle all other requests
app.use((req, res, next)=> {
    
});

// Error Handling middleware
app.use((error, req, res, next)=> {
    res.status(error.statusCode || 400).json({
        errors: [
            {
                message: error.message
            }
        ]
    });
});

module.exports = app;