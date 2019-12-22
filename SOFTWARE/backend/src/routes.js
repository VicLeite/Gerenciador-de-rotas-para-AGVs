const express = require('express');
const agvController = require('./controllers/agvController');
const PostoController = require('./controllers/PostoController');
const ServiceController = require('./controllers/ServiceController');

const routes = express.Router();

routes.post('/newPosto', PostoController.store);
routes.post('/configPosto', PostoController.config);
routes.get('/postos', PostoController.index);
routes.post('/deletePosto', PostoController.deletePosto);
routes.post('/newagv', agvController.store);
routes.get('/agvs', agvController.index);
routes.post('/configAGV', agvController.config);
routes.post('/deleteAGV', agvController.deleteAGV);
routes.post('/service', ServiceController.index);

module.exports = routes;
