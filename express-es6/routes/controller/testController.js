import AppController from './appController';

export default class TestController  extends AppController {
    constructor(...scope){
        super(scope);
    }

    create(req,res,next){
        res.status(200).json({status:200, message:'Inherited method override is done'});
    }
}