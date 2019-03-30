// load modules
const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const hostName = 'mongodb+srv://admin:admin@fsjs-qr097.mongodb.net/fsjstd-restapi?retryWrites=true'; // 'mongodb://localhost:27017'
const databaseName = 'fsjstd-restapi';

const joinUrl = (...args) => args.map(arg => arg.replace(/\/+$/gi,'')).join('/');

mongoose.connect(joinUrl(hostName, databaseName), {useNewUrlParser: true}).then(({ connections }) => {
    connections.forEach(connection => {
        if (connection._hasOpened)
            console.log(`Mongoose connected to MongoDB at '${connection.host}:${connection.port}'`)
        else
            console.log(`Mongoose hasn't connected to MongoDB at '${connection.host}:${connection.port}', please debug`)
    });
}).catch(err => {
    console.log("Error connecting", err.message);
});

// create the Express app
const app = express();
// Enable CORS
app.use(cors());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false }));
// Parse application/json
app.use(bodyParser.json());
// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Database connection check
app.use((req, res, next) => {
  const message = "Server Error";
  switch (mongoose.connection.readyState) {
      case 0: return next({ message, error:"Database is offline" });
      case 2: return next({ message, error:"Database is connecting" });
      case 3: return next({ message, error:"Database is disconnecting" });
      default: next();
  }
});

// Expose additional headers
app.use((req, res, next) => {
  res.set('Access-Control-Expose-Headers','Location');
  next();
})

app.use('/api', routes.api);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: ('string' === typeof err.error) ? err.error : {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
