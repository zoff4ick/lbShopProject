'use strict';

module.exports = function(Cart) {
Cart.observe('before save ',async(ctx)=>{
     
});

Cart.getInfo = async (cartId) => {
    const getCart = await Cart.findOne({
        include: {
            relation: 'productItem',
            // scope: {
            //     include: {
            //         relation: 'product',
            //     },
            // }
        },
        where: { id: cartId }
    });

    let sum = 0;
    // (await getCart.productItem.find()).forEach(item => {
    //     sum += item.totalSum
    // });

    console.log('sum => ', sum)
    return getCart;
}




Cart.remoteMethod(
    'getInfo',
    {
        description: 'show info about carts',
        http: { path: '/getInfo', verb: 'get' },
        accepts: { arg: 'cartId', type: 'string', required: true, http: { source: 'query' } },
        returns: { arg: 'cart', type: 'object' }
    }
);
};
