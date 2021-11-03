const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ambrv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('connected database')
    const database = client.db("tourismServer");
    const productsCollection = database.collection("tPackages")
    const ordersCollection = database.collection('orders');
    
    //get products api
    app.get('/packages', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products)

    })
    //Add Tour Package API Post Api
    app.post('/addPackage', async (req, res) => {
      const package = req.body;
      console.log(package);
      const result = await packageCollection.insertOne(package);
      res.send(result);
    
  });
   //ADD Order by 
   app.post('/orders', async (req, res) => {
    const orderPackage = req.body;
    console.log(orderPackage);
    const result = await ordersCollection.insertOne(orderPackage);
    res.send(result);
});

//GET my Orders
app.get('/myOrders/:email', async (req, res) => {
    const result = await ordersCollection.find({
        email: req.params.email,
    }).toArray();
    res.send(result);
});
   //Get API for Manage All Order
   app.get('/manageAllOrder', async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
    console.log(result);
});

//DELETE an Personal Ordered Event
app.delete('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    // console.log(id);
    const result = await ordersCollection.deleteOne(query);
    console.log("Deleting user with id ", result);
    res.send(result);
});

  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('ema-jhon server-------')
})

app.listen(port, () => {
  console.log('Example app listening at', port)
})
