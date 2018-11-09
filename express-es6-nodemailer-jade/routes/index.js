import express from 'express';
import AppController from './controller/appController';
const appController  = new AppController('Notification  Module');
const router = express.Router();
/* GET home page. */
router.get('/',appController.getHome);
router.get('/mail',appController.sendMail);

module.exports = router;
