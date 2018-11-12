import MailController from "../service/mailService";
const mailController = new MailController();
export default class AppController {
    constructor(...scope) {
        this.scope = scope;
        this.getHome = this.getHome.bind(this);
    }

    getHome(req,res,next){
        res.render('index', { title: `${this.scope.join(' ')}` });
    }

    async sendMail(req,res,next){
        let emailObject = {
            path:'email',
            to:'saikumara@wavelabs.in',
            subject:"Sample EMail",
            content:{"name":"Sai Kumar","text":"Hello Welcome to Notification module"}
        }
        // sendEmail(emailData);
        const response = await mailController.createEmailTemplate(emailObject);
        res.json({status:200, message:'Calling done',data:response});
    }

}