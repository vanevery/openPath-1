var mongoose = require('mongoose');


EventSchema = mongoose.Schema({
	creatorID: String,
	roomID : String,
	dateCreated:  { type: Date, default: Date.now() },
	dateModified: Date,
	name: String,
	link: String,
	description: String,
	location: {
		lat : Number,
		lng : Number
	}, 
	grades: [String],
	startDate :  Date,
	endDate : Date
});

EventSchema.statics.addEvent = function(req, done){
	console.log('ev req = ', req.body)
	this.create({
		creatorID : req.user._id,
		dateCreated : Date.now(),
		dateModified : Date.now(),
		name: req.body.name,
		link: req.body.link,
		description: req.body.description
		//dates, grade, location
	}, function(err, newEvent){
		if(err) throw err;
		// if (err) return done(err);
		done(null, newEvent);
	});
	
}


var Event = mongoose.model("Event", EventSchema);
module.exports = Event;