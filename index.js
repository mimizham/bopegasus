
var express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
var app = express();

// Create a write stream (in append mode) for the log file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

morgan.token('req-body', (req) => JSON.stringify(req.body));

// Use morgan middleware with a custom format to log requests to the file
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body', { stream: accessLogStream }));


app.use(express.json());

const { OrdersModel } = require('./mongoose');
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
app.get('/', async (req, res) => {
    const orders = await OrdersModel.find();
    console.log('Fetched data:', orders);
    res.json(orders);
});

app.post("/addOrder", async (req, res) => {
    if(!req.body.order ||  !req.body.order.orderCode){
    res.json({ result: false,responseCode:99, response: "Empty Request" })
    }
    const orders = await OrdersModel.findOne({ orderCode: req.body.order.orderCode });   
    if ( orders && orders!==null && Object.keys(orders).length > 0 && orders.orderCode == req.body.order.orderCode) {
        res.json({ result: false,responseCode:11, response: "Product Already Exists" });
    } else {
        if (req.body.order) {
            let orderTmp=req.body.order;
            const currentDate = new Date();
            const dateString = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Casablanca" }).format(currentDate);
            orderTmp.orderDate=dateString;
            
            var orderAdd = new OrdersModel(req.body.order);
            orderAdd.save()
                .then(r => {
                    res.json({ result: true });
                }).catch(e => {
                    res.json({ result: false,responseCode:3, response: e.message });
                })

        } else {
            res.json({ result: false, response: "Order Body Json empty" });
        }
    }

});

app.post('/endOrder',async (req,res)=>{

    
        if(!req.body || !req.body.orderCode){
        res.status(500).json({ result: false,responseCode:99, response: "Empty Request" })
        }
        var order = await OrdersModel.findOneAndUpdate({ orderCode: req.body.orderCode },{orderStatus:'ready'}, { new: true });   
        
        if(order && order.orderStatus=="ready"){
            res.status(200).json({});
        }else{
            res.status(500).json({});
        }
});

app.get("/allCurrentOrders",async (req,res)=>{
    const orders = await OrdersModel.find({ orderStatus: "accepted" });   
    res.json(orders);

});


app.post('/endByOrder',async (req,res)=>{
    if(!req.body ||  !req.body.orderCode){
        res.status(500).json({ result: false,responseCode:99, response: "Empty Request" })
        }
        const result = await OrdersModel.updateMany(
            {
              orderNumber: req.body.orderCode,
              orderStatus: "accepted",
              productType: "Glovo"
            },
            { $set: { orderStatus: 'ready' } },
            { new: true }
          );

          if(result){
            res.status(200).json({});
          }else{
            res.status(204);
          }

});

require('dotenv').config();

if(process.env.ENV && process.env.ENV=="DEV"){
    app.listen(3000, () => {
        console.log("Up 3000");
    })
}else{
    app.listen();
}

