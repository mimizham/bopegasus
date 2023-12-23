
const mongoose = require('mongoose');
const {Orders} = require("./models/orders");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connected");
});
const OrdersModel = mongoose.model('Orders', Orders);

module.exports={OrdersModel}
