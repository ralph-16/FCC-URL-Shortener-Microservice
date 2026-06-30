require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const dns = require('node:dns')

const urlDatabase = {}
let counter = 1

// Basic Configuration
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  let hostname;

  try {
    hostname = new URL(req.body.url).hostname;
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' })
    }

    res.json({
      original_url: req.body.url,
      short_url: counter
    })
    urlDatabase[counter] = req.body.url
    counter++
  })
})

app.get('/api/shorturl/:id', function (req, res) {
  const id = parseInt(req.params.id)
  if (urlDatabase[id] === undefined) {
    res.json({ error: "No short URL found for the given input" })
  } else {
    res.redirect(urlDatabase[id])
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
