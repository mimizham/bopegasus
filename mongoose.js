
const mongoose = require('mongoose');
const {Orders} = require("./models/orders");
mongoose.connect("mongodb://apppuser:d545d21GitklQPA@13.48.130.238:443/leclddb?authMechanism=DEFAULT&directConnection=true")
.then(()=>{
    console.log("connected");
});
const OrdersModel = mongoose.model('Orders', Orders);

module.exports={OrdersModel}
