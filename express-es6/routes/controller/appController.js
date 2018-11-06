export default class AppController {
    constructor(...scope){
        this.scope = scope;
        this.create = this.create.bind(this);
        this.middileware = this.middileware.bind(this);
        this.update = this.update.bind(this);
    }

    middileware(req,res,next){
        //modify the request object and pass the controller to next function
        this.scope = 'Middleware';
        next()
    }
    create(req,res,next){
        res.json({"status":200, "message":"Calling done sucess", "data":this.scope});
    }
    update(req,res,next){
        res.json({status:200,message:'update calling done'});
    }
}