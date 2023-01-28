// when a request is sent to /api/new-meetup, Next.js will trigger this function:

import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body; //getting the req.body, which will contain the form data (title, image, address, description)

    const client = await MongoClient.connect(
      process.env.MY_ENVIRONMENT_VARIABLE
    ); //add username and password where needed; the name 'meetups-db' after 'mongodb.net/' is the name of our db, it'll be created on the fly as we use it.
    const db = client.db('meetups-db');

    const meetupsCollection = db.collection('meetups'); //this is the name if your collection inside 'meetups-db' database.

    const result = await meetupsCollection.insertOne(data); //inserting new document into the collection.

    console.log(result);

    client.close(); //closing the connection;

    res.status(201).json({ message: 'Meetup inserted!' }); // giving a response with a custom message.
  }
}

export default handler;
