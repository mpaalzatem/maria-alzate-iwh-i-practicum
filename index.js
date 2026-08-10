require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// Homepage - GET request to retrieve all deals and render them in a table
app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/deals?properties=name,species,watering_frequency';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const resp = await axios.get(url, { headers });
    const records = resp.data.results;
    res.render('homepage', { title: 'Custom Object Homepage', records });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching records');
  }
});

// Show the form to create a new record
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Process the form and create a new record
app.post('/update-cobj', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/deals';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const data = {
    properties: {
      dealname: req.body.name,
      name: req.body.name,
      species: req.body.species,
      watering_frequency: req.body.watering_frequency
    }
  };

  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('App listening on port 3000'));