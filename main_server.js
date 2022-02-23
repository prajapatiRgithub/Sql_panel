const express = require('express');
const app = express();
const path = require('path');
const db = require('./db/db');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
dotenv.config();

const routes = require('./routes/route');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false, parameterLimit:100000,limit:'500mb' }))
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', routes);
app.use(express.static("public/uploads"));

const port = process.env.PORT || 5002;
app.listen(port, () => console.log(`Listening on port ${port}...`));
