'use strict'

//cargar librerias y variables
var express = require ('express');
var ArtistController =require('../controllers/artist');
var api = express.Router();
var md_auth = require ('../middlewares/authenticated');
var multipart =require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});

api.get('/artist/:id',md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?',md_auth.ensureAuth, ArtistController.getArtists);
api.post('/register-artist',md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/update-artist/:id',md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id',md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile',ArtistController.getImageFile);

module.exports = api;
