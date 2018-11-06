import express from 'express';
import Handler from './controller/handler';
import AppController from './controller/appController';
import TestController from './controller/testController';

const handler = new Handler('test');
const appController = new AppController('Todo');
const testController = new TestController('todoTest');

const router= express.Router();
router.get('/',handler.requesHandler);
router.route('/todo').get(appController.middileware, appController.create);
router.route('/test').get(testController.update).post(testController.create); // inherited class 
export default router;
