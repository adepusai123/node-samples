import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes/';

const app = express();
const port = process.env.PORT || 8008;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use('/',routes);


/* app.get('/',(req,res)=>{
    res.send('Hello World !');
});
 */
const server = app.listen(port, (err)=>{
    console.log(err ? err : 'server running on :', server.address().port);
});

export default app;
