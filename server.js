const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const server = express();

const Bear = require('./BearModel.js');

server.use(helmet()); 
server.use(cors());   
server.use(bodyParser.json());

server.get('/', function(req, res) {
  res.status(200).json({ status: 'API Running' });
});

server.get('/api/bears', function(req, res) {
    Bear.find()
      .then(bears => {
        res
        .status(200)
        .json(bears);
      })
      .catch(error => {
        res
        .status(500)
        .json({ error: 'The Bears are Missing!'});
      });
});

server.get('/api/bears/:id', (req, res) => {
  const { id } = req.params;
  Bear.findById(id)
   .then(bear => {
      res
      .status(200)
      .json(bear);
    })
    .catch(error => {
      res
      .status(500)
      .json({ error: `Oh No, we can't find the Bear!!!`});
    });
});

server.delete("/api/bears/:id", (req, res) => {
  const { id } = req.params;
  Bear.findByIdAndRemove(id)
  .then(bear => {
    if (bear) {
      res
      .status(200)
      .json({ message: 'The sweet bear is gone forever' });
    } else {
      res
      .status(404)
      .json({ error: 'If a bear is deleted in the forest without an id, does anyone notice it is gone?' })
    }
  })
  .catch(error => {
    res
    .status(500)
    .json({ error: 'The bear cannot just be forgotten' });
  })
});

server.post('/api/bears', function(req, res) {
    const bearInformation = req.body;
    const bear = new Bear(bearInformation);
    bear
        .save()
        .then(savedBear => {
          res.status(201).json(savedBear);
        })
        .catch(error => {
          res
          .status(500)
          .json({
            error: 'There was an error while saving the Bear to the Database.'
          })
        });
});

mongoose
      .connect('mongodb://localhost/BearKeeper')
      .then(db => {
        console.log(`Successfully connect to the ${db.connections[0].name} database`);
      })
      .catch(error => {
        console.log(`Database Connection Failed`);
      });

const port = process.env.PORT || 5005;
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
});
