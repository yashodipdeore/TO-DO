import express from 'express';


//==============================================
const app = express();

app.set('view engine', 'ejs');
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

//===============================================
const PORT = 3000;

app.listen(PORT, () => {
  console.log('server is running at : http://localhost:' + PORT);
});