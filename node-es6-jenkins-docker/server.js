/*
 * Main file
 */
import express     from 'express';
import bodyParser  from 'body-parser';
import mongoose    from 'mongoose';
import morgan      from 'morgan';
import swaggerUi   from 'swagger-ui-express'
import config      from 'config';
import Routes      from './app/routes';
import swaggerSpec from './config/swagger';

let app   = express();

/*  DB Connection */
mongoose.connect(config.get("database.url"));

/* Middlewares */
app.use(morgan('combined'));                       //logging
app.use(bodyParser.json());                        //parsing request body
app.use(bodyParser.urlencoded({ extended: true }));//parsing request queries
app.use(config.get('v1_base_path'), Routes);
app.use(config.get('v1_base_path') + "/document", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function (err, req, res, next) {
    console.log(err, err);
    res.status(err.code || 500).json({error: err.name, error_description: err.message})
});

export default app;
