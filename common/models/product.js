'use strict';

module.exports = function(Product) {
    Product.observe('before save', async (ctx) => {
        if(ctx.data.price&&ctx.data.price!==Product.price){
            ctx.hookState.oldPrice=ctx.currentInstance.price;
        }

        
    });


    Product.observe('after save', async (ctx) => {
        const app = require('../../server/server');
        //console.log(ctx.instance.id);

        const Cartitem = app.models.CartItem;
        
        if(ctx.instance.price!==ctx.hookState.oldPrice){ 
            const getCartItem = await Cartitem.find({
                include: {
                    relation: 'product',
                },
                where: { productId: ctx.instance.id }
            });
            //console.log(getCartItem)

            getCartItem.forEach(element => {
                element.save();
            });
          
        }
        else{
            return;
        }
    });
};
