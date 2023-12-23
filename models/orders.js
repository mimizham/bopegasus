
const Schema = require('mongoose').Schema;
const Orders = Schema({
  productType: String,
  products: [
    {
      title: String,
      urlImage: String,
      quantity: String,
      price: String,
      options: [
        {
          quantity: String,
          title: String,
        },
      ],
    },
  ],
  orderCode: String,
  orderNumber: String,
  CustomerName: String,
  productsCount: String,
  orderStatus: String,
  orderDate:String,
  orderTotalPrice:Number
},
  { collection: "orders" });

/* global db */
module.exports = { Orders }