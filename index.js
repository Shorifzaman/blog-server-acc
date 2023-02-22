const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `${process.env.MONGODB_URL}`;

const client = new MongoClient(uri, { 
    useNewUrlParser: true, useUnifiedTopology: true, 
    serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const blogsCollection = client.db("blogs-database").collection("blogs-collection");
        
        app.get("/blogs", async (req, res) => {
            const blogs = await blogsCollection.find().toArray();
            res.send(blogs);
        });
        app.post("/blog", async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            res.send(result);
        });
        app.patch("/blog", async (req, res) => {
            const blog = req.body;
            const filter = { _id: ObjectId(req.body._id) };
            delete blog._id;

            const updateDoc = {
                $set: blog
            };
            const result = await blogsCollection.updateOne(filter, updateDoc);
            res.send(result);
        });
        app.delete("/blog/:id", async (req, res) => {
            const id = req.params.id;
            const result = await blogsCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });
        app.get("/reading-list/", (req, res, next) => {
            Reading.find().toArray((err, data) => {
              res.json({ data });
            });
          });
      
          app.post("/add-to-reading-list/", (req, res, next) => {
            const data = req.body;
            Reading.insertOne(data).then((data) => {
              res.json({ success: !!data.result.ok, data: data });
            });
          });
      

    }
    finally { };
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Blogs server get API Done');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});