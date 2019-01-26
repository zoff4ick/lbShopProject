'use strict';
const app = require('../../server/server')
module.exports = function (user) {

    user.validatesUniquenessOf('email');

    user.afterRemote('create', async (ctx, user, next) => {
        const Cart = app.models.Cart;
        await Cart.create({
            totalSum: 0,
            userId: user.id
        });
    });





    user.makeOrder = async (cartId) => {
        const Cart = await user.app.models.Cart;
        const cart = await Cart.findOne({
            include: {
                relation: 'productItem',
            },
            where: { id: cartId }
        });
        const items = await cart.productItem.find({});

        const Order = await user.app.models.Order.create({
            price: cart.totalSum,
            userId: cart.userId
        });


        items.forEach(element => {
            element.orderId = Order.id;
            element.save();
        });

        await Cart.destroyById(cartId);
        await Cart.create({
            totalSum: 0,
            userId: Order.userId
        });


        
    }


 user.awesomeEmail = async(userId)=>{
       
    };


    user.remoteMethod(
        'awesomeEmail',
        {
            description: 'Take nice email ',
            http: { path: '/awesomeEmail', verb: 'get' },
            accepts: { arg: 'userId', type: 'string', required: true, http: { source: 'query' } },
            returns: null
        }
    )

    user.remoteMethod(
        'makeOrder',
        {
            description: 'Ordering all products from the cart ',
            http: { path: '/makeOrder', verb: 'post' },
            accepts: { arg: 'cartId', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'order', type: 'object' }
        }
    );

}
