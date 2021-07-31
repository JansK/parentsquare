const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// defining the Express app
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

require('./routes/text.routes.js')(app);

app.all('/', (req, res) => {
  res.send("Yes, your local server is running");
});

app.listen(3001, () => {
  console.log('listening on port 3001');
});