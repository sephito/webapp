'use strict'

//cargar librerias y variables
var express = require ('express');
var TrackerController =require('../controllers/tracker');
var api = express.Router();
var md_auth = require ('../middlewares/authenticated');

api.get('/tracker/:id',md_auth.ensureAuth, TrackerController.getTracker);
api.post('/register-tracker',md_auth.ensureAuth, TrackerController.saveTracker);
api.put('/update-tracker/:id',md_auth.ensureAuth, TrackerController.updateTracker);

module.exports = api;
