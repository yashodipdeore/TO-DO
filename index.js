import express, { response, urlencoded } from 'express';
import path from 'path'
import { MongoClient, ObjectId } from 'mongodb';
import { connect } from 'http2';
import { url } from 'inspector';


//==============================================
const app = express();
app.set('view engine', 'ejs');

const publicPath = path.resolve('public');
app.use(express.static(publicPath));

app.use(express.urlencoded({ extended: false }));
//----------- DB Connection --------

const dbName = 'Todo';
const collectionName = 'Tasks';
const URL = 'mongodb://localhost:27017';
const client = new MongoClient(URL);

const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};



//===============================================
app.get('/', async (req, res) => {

  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.find().toArray();
  console.log(result);

  res.render('list', { result });

});


app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/update', (req, res) => {
  res.render('update');
});


app.get("/delete/:id", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne(
    { _id: new ObjectId(req.params.id) });
  if (result) {
    res.redirect('/');
  } else {
    res.redirect('/add');
  }
});

//-------- POST -----------
app.post('/add', async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  console.log(req.body);

  const result = collection.insertOne(req.body);
  if (result) {
    res.redirect('/');
  } else {
    res.redirect('/add');
  }

});

app.post('/update', (req, res) => {
  res.redirect('/');
});


//===============================================
const PORT = 3000;

app.listen(PORT, () => {
  console.log('server is running at : http://localhost:' + PORT);
});