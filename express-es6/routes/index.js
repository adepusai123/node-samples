import express from 'express';
import Handler from './controller/handler';
const handler = new Handler('test');
const router= express.Router();
router.get('/',handler.requesHandler);
export default router;
