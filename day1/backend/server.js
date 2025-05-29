const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://mongo:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
