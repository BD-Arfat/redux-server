const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000;

app.get("/", (req, res) => {
    res.send("hi hello")
});
app.use(cors());
app.use(express.json());
require('dotenv').config();


//////////////////////



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_APSS}@cluster0.s0vwyit.mongodb.net/?retryWrites=true&w=majority`;

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
        const productCollection = client.db('rtk-shops').collection('products');
        const tagsCollection = client.db('rtk-shops').collection('tags');


        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });
        app.post('/products', async (req, res) => {
            const user = req.body;
            const result = await productCollection.insertOne(user);
            res.send(result)
        });
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result)
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const queyr = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(queyr);
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const user = req.body;
            const options = { upsert: true };
            const updateduser = {
                $set: {
                    name: user.name,
                    model: user.model,
                    image: user.image,
                    Description: user.Description,
                    tag: user.tag
                }
            }
            const result = await productCollection.updateOne(filter, updateduser, options);
            
            res.send(result)
        })

        app.get('/tags', async (req, res) => {
            const query = {};
            const cursor = tagsCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })
        app.get('/tags/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await tagsCollection.findOne(query);
            res.send(user)
        })


    }
    finally {

    }
}
run().catch(console.dir);


//////////////////////

app.listen(port, () => {
    console.log(`hi hello ${port}`)
})
