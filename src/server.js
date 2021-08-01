const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {
	createMongoMemoryServer
} = require('./database/mongo');
const mongoose = require('mongoose');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

require('./routes/text.routes.js')(app);
require('./routes/delivery.routes.js')(app);

app.all('/', (req, res) => {
	res.send("Yes, your local server is running");
});

mongoose.Promise = global.Promise;
createMongoMemoryServer().then((mongoServer) => {
	const mongoUri = mongoServer.getUri();
	mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log("Successfully connected to the database");
	}).catch(err => {
		console.log('Could not connect to the database. Exiting now...', err);
		process.exit();
	});
	const db = mongoose.connection;

	db.on('open', () => {
		app.listen(3001, async () => {
			console.log('listening on port 3001');
		});
	});
});