import express, { response, urlencoded } from 'express';
import path from 'path'
import { MongoClient, ObjectId } from 'mongodb';
import { connect } from 'http2';
import { url } from 'inspector';
import { connected, title } from 'process';


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

  res.render('list', { result });

});


app.get('/add', (req, res) => {
  res.render('add');
});


app.get('/update/:id', async (req, res) => {
  const id = req.params.id;

  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.findOne({ _id: new ObjectId(id) });

  res.render('update', { result });
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

  const result = collection.insertOne(req.body);
  if (result) {
    res.redirect('/');
  } else {
    res.redirect('/add');
  }

});

app.post('/update/:id', async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;

  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.updateOne(
    {
      _id: new ObjectId(id)
    },
    {
      $set: {
        title: title,
        description: description
      }
    }
  );

  if (result) {
    res.redirect('/');
  } else {
    res.send("Cannot update task !");
  };
});



app.post('/multi-delete', async (req, res) => {
  const ids = req.body.selectedTasks;
  const ObjectIds = ids.map(id => new ObjectId(id));

  const db = await connection();
  const collection = db.collection(collectionName);
  console.log(ids);

  const result = await collection.deleteMany({
    _id: { $in: ObjectIds }
  });

  if (result) {
    res.redirect('/');
  } else {
    res.send("Cannot update task !");
  };
});

//===============================================
const PORT = 3000;

app.listen(PORT, () => {
  console.log('server is running at : http://localhost:' + PORT);
});