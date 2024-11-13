const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');
const { apiRouter } = require('./routes/api');
const cronTask = require('./app/Helper/croneJob');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// set the view engine to ejs
app.set('view engine', 'ejs');

cronTask.start();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '60mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const corsOptions = {
  origin: ['http://localhost:3000','https://education.indianexpress.com','https://indianexpress.com','https://microsites.indianexpress.com','http://education.indianexpress.com','http://indianexpress.com','http://microsites.indianexpress.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Find-and-Glow",
      version: "1.0.0",
    },
    servers: [{ url: process.env.BASE_URL }],
  },
  apis: ["./routes/*.js"], // your route folder
};

// Read swagger.json file
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

app.use(
  "/api-docs",
  (req, res, next) => {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

app.use(fileupload());
// app.use('/public/uploads', express.static('/public/uploads'));

app.use('/api', apiRouter);

// Create an asynchronous function to start the server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

// Call the function to start the server
startServer();
