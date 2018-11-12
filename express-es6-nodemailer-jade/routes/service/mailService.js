import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import fs from 'fs';
import jade from 'jade';
import path from 'path';
const root_path = path.dirname(require.main.filename);

export default class MailController {
    constructor(...scope){
        this.scope = scope[0];
        this.smtpTransport = nodemailer.createTransport({
            pool:true,
            host:'smtp.gmail.com',
            port: 443,
            ignoreTLS:true,
            service: "gmail",
            secure: false,
            auth: {
                user: 'xxxx@xxx.com',
                pass: 'xxxxxx'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        });
        this.createEmailTemplate = this.createEmailTemplate.bind(this);;
        this.createMailObject = this.createMailObject.bind(this);
    }
    async createEmailTemplate(data){
        try{
            const html = await this.createHtmlFromJade(data);
            const mailObject = await this.createMailObject(html, data);
            const sendEmail = await this.sendMailNow(mailObject);
            return sendEmail;
        } catch(e){
            return false;
        }
    }    
    createHtmlFromJade(data){
        return new Promise((resolve, reject) => {
            const template = `${root_path}/views/emailTemplates/${data.path}.jade`;
            fs.readFile(template, 'utf8', function(err, file) {
                if(err) reject(err);
                const html = jade.compile(file)(data.content);
                resolve(html);
            });
        }) 
    }
    createMailObject(html,data){
        return new Promise((resolve)=>{
            const mail = {
                from: 'alert@pwc.com',
                to: data.to,
                cc:data.cc ? data.cc :'',
                bcc:data.bcc ? data.bcc : '',
                subject: data.subject,
                html: html,
                attachments:data.attachments ? data.attachments : []
            }
            resolve(mail);
        });
    }
    sendMailNow(mail){
        return new Promise((resolve, reject) =>{
            this.smtpTransport.sendMail(mail,(error, response)=>{
                if(error){
                    reject(error);
                }
                this.smtpTransport.close();
                resolve(response);
            });
        });
    }
}