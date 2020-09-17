const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
// Settings
app.set('port', process.env.PORT || 3000);

const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Agora delivery API",
      description: "Agora delivery API Information",
      contact: {
        name: "Christian Albaladejo Carrasco"
      },
      servers: ["https://panesandco.herokuapp.com/"]
    }
  },
      apis: ['src/routes/*.js']
  /* apis: ["app.js"] */
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});
// Routes
app.use(require('./routes/routes'));
app.use(require('./routes/admin'));
app.get('/form', csrfProtection, (req, res) => {
  // pass the csrfToken to the view 
  res.json( req.csrfToken() );
});

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
