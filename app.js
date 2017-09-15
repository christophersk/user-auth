const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const {db} = require('./db');
const port = 3000;
const routes = require('./routes');
const session = require('express-session');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: false,
  resave: false
}))

app.engine('html', nunjucks.render);
app.set('view engine', 'html');
const env = nunjucks.configure('views', { noCache: true });


app.use(routes);

db.sync({ force: true })
.then(function () {
  app.listen(port, () => {
    console.log('app listening on ' + port);
  })
})
