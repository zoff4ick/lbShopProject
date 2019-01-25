'use strict';

module.exports = function (Cartitem) {
    Cartitem.observe('before save', async (ctx) => {
        if (ctx.instance) {
            const product = await Cartitem.app.models.Product.findById(ctx.instance.productId);
            ctx.instance.totalSum = product.price * ctx.instance.quantity;
            ctx.instance.name = product.name;
        } else if (ctx.data.quantity) {
            const product = await Cartitem.app.models.Product.findById(ctx.currentInstance.productId);
            ctx.currentInstance.totalSum = product.price * ctx.data.quantity
            ctx.data.totalSum = product.price * ctx.data.quantity;
        }
    })

    Cartitem.observe('after save', async (ctx) => {
        const getCart = await Cartitem.app.models.Cart.findOne({
            include: {
                relation: 'productItem',
            },
            where: { id: ctx.instance.cartId }
        });
        if(getCart!==null){
        getCart.totalSum = 0;
        getCart.productItem().forEach(product => {
            getCart.totalSum += product.totalSum;
        });
        await getCart.save();
    }});

    Cartitem.observe('before delete', async (ctx) => {
        const cartItem = await Cartitem.findById(ctx.where.id);
        const getCart = await Cartitem.app.models.Cart.findById(cartItem.cartId);
        if(getCart.totalSum!==null){
        getCart.totalSum -= cartItem.totalSum;
        await getCart.save();
        }
    });
};
