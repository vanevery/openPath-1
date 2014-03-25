var mongoose = require('mongoose');
var Room = require('../models/room');

EventSchema = mongoose.Schema({
	creatorID: String,
	roomID : String,
	dateCreated:  { type: Date, default: Date.now },
	dateModified: Date,
	name: String,
	link: String,
	description: String,
	location: {
		name : String,
		longitude : Number,
		latitude : Number,
		reference : String
	}, 
	grades: [String],
	date : Date,
	startTime:  String,
	endTime : String
});

EventSchema.statics.addEvent = function(req, done){
	var self = this;
	//make new room
	Room.makeRoom(req.user._id, function(err, room){
		if(err) throw err;
		//console.log('room=',room);

		//set room for event
		createEvent( room );
	});

	function createEvent( room ){
		console.log('ev req = ', req.body);

		self.create({
			creatorID : req.user._id,
			roomID : room._id,
			dateCreated : Date.now(),
			dateModified : Date.now(),
			name: req.body.name,
			link: req.body.link,
			description: req.body.description,
			location : {
				name : req.body.location,
				longitude : req.body.longitude,
				latitude : req.body.latitude,
				reference : req.body.reference,
				formatted_address : req.body.location
			},
			date : req.body.date,
			startTime:  req.body.startTime,
			endTime : req.body.endTime
			//TODO: grades
		}, function(err, newEvent){
			if(err) throw err;
			// if (err) return done(err);
			done(null, newEvent);
		});
	}

	
}


var Event = mongoose.model("Event", EventSchema);
module.exports = Event;