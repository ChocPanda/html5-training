'user strict'

const compareSellers = (sellerA, sellerB) => {
    return (sellerA.price < sellerB.price ? 1 :
            sellerA.price > sellerB.price ? -1 :
            sellerA.orderTime < sellerB.orderTime ? 1 :
            sellerA.orderTime > sellerB.orderTime ? -1 :
            0)
};

const compareBuyers = (buyerA, buyerB) => {
    return (buyerA.price > buyerB.price ? 1 :
            buyerA.price < buyerB.price ? -1 :
            buyerA.orderTime < buyerB.orderTime ? 1 :
            buyerA.orderTime > buyerB.orderTime ? -1 :
            0)
};

module.exports = {
    compareSellers,
    compareBuyers
}