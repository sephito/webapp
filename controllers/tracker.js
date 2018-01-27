'use strict'

var path = require('path');
var fs = require ('fs');
var mongoosePaginate = require('mongoose-pagination');

/*Modelos*/
var Tracker = require ('../models/tracker');


/*obtener Album por ID*/
function getTracker(req,res){
	//variable para obtener el ID DEL ALBUM
	var trackerId = req.params.id;
	//findById = Obtener el Objeto Album
	Tracker.findById(trackerId).populate({path: 'tracker'}).exec((err,tracker)=>{
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!tracker){
				res.status(404).send({message:'El album no existe'});
			}else{
				res.status(200).send({tracker});
			}
		}
	});

}



function guardarTracker(req,res){
var tracker = new Tracker();
var trackerId = req.params.id;
var params = req.body;
var identity_user_id = req.user.sub;

tracker.key = params.key;
tracker.lat = params.lat;
tracker.lng = params.lng;
tracker.nombre = params.nombre;

Tracker.find(key:identity_user_id).populate({path: 'tracker'}).exec((err,tracker)=>{
	if(err){
		res.status(500).send({message:'Error en la petición'});
	}else{
		if(!tracker){
			 //guadar el usuario
			if(tracker.key !=null && tracker.nombre != null){
			 tracker.save((err,trackerStored) => {
				 if(err){
					 res.status(500).send({message:'Error al guardar el album'});
				 }else{
					 if(!trackerStored){
					 res.status(404).send({message:'no se ha registrado el album'});
					 }else{
						 res.status(200).send({tracker:trackerStored});
					 }
				 }
			 });
			}else{
			 res.status(200).send({message:'Introduce todos los campo3s'});
			}
		}else{
			//actualiza
			Tracker.findByIdAndUpdate(trackerId, params, (err,trackerUpdated) => {
	 	 	if(err){
	 	 		res.status(500).send({message: 'Error al actualizar el tracker'});
	 	 	}else{
	 	 		if(!trackerUpdated){
	 	 			res.status(404).send({message:' no se ha podido actualizar el tracker'});
	 	 		}else{
	 	 			res.status(200).send({tracker: trackerUpdated});
	 	 		}
	 	 	}
	 	 });
		}
	}
});

}


function saveTracker(req,res){
	var tracker = new Tracker();

	var params = req.body;



	tracker.key = params.key;
	tracker.lat = params.lat;
	tracker.lng = params.lng;
	tracker.nombre = params.nombre;



			 if(tracker.key !=null && tracker.nombre != null){
				//guadar el usuario
				tracker.save((err,trackerStored) => {
					if(err){
						res.status(500).send({message:'Error al guardar el album'});
					}else{
						if(!trackerStored){
						res.status(404).send({message:'no se ha registrado el album'});
						}else{
							res.status(200).send({tracker:trackerStored});
						}
					}
				});
			 }else{
			 	res.status(200).send({message:'Introduce todos los campo3s'});
			 }


}

function updateTracker(req,res){
	 var trackerId = req.params.id;
	 var update = req.body;


	 Tracker.findByIdAndUpdate(trackerId, update, (err,trackerUpdated) => {
	 	if(err){
	 		res.status(500).send({message: 'Error al actualizar el tracker'});
	 	}else{
	 		if(!trackerUpdated){
	 			res.status(404).send({message:' no se ha podido actualizar el tracker'});
	 		}else{
	 			res.status(200).send({tracker: trackerUpdated});
	 		}
	 	}
	 });
}





module.exports = {
	getTracker,
	saveTracker,
	updateTracker,
	guardarTracker
};
