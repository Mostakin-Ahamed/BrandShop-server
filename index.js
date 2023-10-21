const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mostakinahamed.fo1obhn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const carCollection = client.db('CarDB').collection('Cars');
        const cartCollection = client.db('CarDB').collection('Cart')


        app.get('/brandDetail', async(req, res)=>{
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/brandDetail/:brandName', async(req, res)=>{
            const brand = req.params.brandName;
            const query={brandName:brand};
            const cursor = carCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/cart', async(req, res)=>{
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/update/:id', async(req, res)=>{
            const id= req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await carCollection.findOne(query);
            res.send(result);
        })

        app.put('/update/:id', async(req, res)=>{
            const id=req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = {upsert: true};
            const updatedCar = req.body;
            console.log(updatedCar);
            const car ={
                $set:{
                    productName:updatedCar.productName,
                    brandName:updatedCar.brandName,
                    price:updatedCar.price,
                    rating:updatedCar.rating,
                    detail:updatedCar.detail,
                    photo:updatedCar.photo
                }
            }
            const result = await carCollection.updateOne(filter,car,options)
            res.send(result)
        })

        app.post('/cart', async(req, res)=>{
            const newCart = req.body;
            const result = await cartCollection.insertOne(newCart);
            res.send(result)
        })

        app.post('/addProducts', async(req, res)=>{
            const newCar=req.body;
            const result = await carCollection.insertOne(newCar);
            res.send(result);
        })

        app.delete('/cart/:id', async(req, res)=>{
            const id = req.params.id;
            const query={_id: new ObjectId(id)}
            const result= await cartCollection.deleteOne(query);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Automobile server is running')
})

app.listen(port, () => {
    console.log(`Automobile server is running on server ${port}`);
})