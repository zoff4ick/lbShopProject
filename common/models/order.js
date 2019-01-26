'use strict';

module.exports = function(Order) {
     Order.observe('after save', async (ctx) => {
        const thisUser = await Order.app.models.user.findById(ctx.instance.userId);
         const items = await Order.findOne({
            include: {
                relation: 'productItem',
            },
            where: { id: ctx.instance.id }
        });
        var mailer = require("nodemailer");

        // Use Smtp Protocol to send Email
        var smtpTransport = mailer.createTransport({
            pool: true,
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
            auth: {
                user: "example@gmail.com",
                pass: "example"
            }
        });
        
        var mail = {
            from: "Kunnik <example@gmail.com>",
            to: thisUser.email,
            subject: "Email from the Sviat's Shop!",
            text: `Hi, ${thisUser.name} ! Thanks for your order. You bought items on sum: ${ctx.instance.price}. Check all your order information by id:${ctx.instance.id}` 
            //html: "<b>Hi, ${thisUser.name} ! Thanks for your order. You bought items on sum: ${ctx.instance.price}. Check all your order information by id:${ctx.instance.id}</b>"
        }
        
        smtpTransport.sendMail(mail, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
            smtpTransport.close();
        });
       });

};
