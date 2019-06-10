const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const logger = require('./middleware/logger');
const app = express();
const MongoClient = require('mongodb').MongoClient;

//Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));

app.post('/api/emails', async(req, res) => {
  const emails = await loadEmailsCollection();
  await emails.insertOne({
    emailTo: req.body.emailTo,
    text: req.body.text,
    emailFrom: req.body.from
  })
  res.status(201).send();
})

// Handle production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(__dirname + '/public/'));

  // Handles SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

async function loadEmailsCollection() {
  const client = await MongoClient.connect
  ('mongodb+srv://matiss:M6939937510d@fewclicks-nhdxn.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true
  });
  
  return client.db('fewclicks').collection('emails');
}

const port = process.env.PORT || 5555;

app.listen(port, ()=> console.log(`Server started on port ${port}`));