'use strict'

//librerias importar
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//variable
var app = express();

//configurar cabeceras http
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With, Content-Type,Accept,Access-Allow-Request-Mehodo');
	res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
	res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
	next();
});

//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');
var tracker_routes = require('./routes/tracker');

//Convertir a objeto json las peticiones que nos llegan por HTTP
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//rutas base
//app.use(express.static(path.join(__dirname,'client')));
app.use('/',express.static('client',{redirect:false}));
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
app.use('/api', tracker_routes);

app.get('*',function(req,res,next){
	res.sendFile(path.resolve('client/index.html'));
});

//express dentro de otros ficheros que incluyan APP
module.exports = app;
