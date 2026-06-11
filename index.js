import express from 'express';
import path from 'path'

//==============================================
const app = express();
app.set('view engine', 'ejs');


const publicPath = path.resolve('public');
console.log(publicPath);

app.use(express.static(publicPath));

//===============================================

app.get('/', (req, res) => {
  res.render('list');
});


app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/update', (req, res) => {
  res.render('update');
});



//-------- POST -----------
app.post('/add', (req, res) => {
  res.redirect('/');
});

app.post('/update', (req, res) => {
  res.redirect('/');
});


//===============================================
const PORT = 3000;

app.listen(PORT, () => {
  console.log('server is running at : http://localhost:' + PORT);
});