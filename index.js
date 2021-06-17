const MongoClient = require('mongodb').MongoClient;
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const url = process.env.NODE_ENV;
const app = express();
const port = 3000;
const dbName = "movie-app";
const collectionName = "movies";
let client = "";

const connectToDB = async () => {
    client = await MongoClient.connect(url);
}

app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.json({message:"Server is up..."});
});

app.get('/movieList',async(req, res) =>{
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.find().toArray();
    res.send(JSON.stringify(response));
} );

app.post('/addMovie', async (req, res) => {
    const { name, year,length } = req.body;
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.insertMany([{ name: name, year: year, length: length }])
    res.send(JSON.stringify(response.result));
});

app.put("/updateMovie/:name", async (req, res) =>{
    const { name:movieName } = req.params;
    const year = req.body.year;
    const collection = client.db(dbName).collection(collectionName);

    const response = await collection.updateOne(
        {name: movieName},
        {
            $set:{
                year: year
            }
        }
    );
    res.send(JSON.stringify(response.result));
});

app.delete('/delete/:movieName', async (req, res) => {
    const { movieName } = req.params;
    const collection = client.db(dbName).collection(collectionName);

    const response = await collection.deleteOne({ name: movieName });

    res.send(JSON.stringify(response.result));
});

connectToDB();
app.listen(3000);