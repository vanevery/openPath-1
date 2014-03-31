'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class User, you :)
 */
OpenPath.User = function( obj ){
	//console.log('new User');
	this.obj = obj;
	this.video = new OpenPath.Video(this);

};
OpenPath.User.prototype.connect = function(){
	this.getMyMedia();
	this.getMyLocation();
};
/**
 * getMyMedia, send to socket
 */
OpenPath.User.prototype.getMyMedia = function(){
	var self = this;

	if(navigator.getUserMedia) {
		navigator.getUserMedia( {video: true, audio: true}, function(stream) {

			console.log('got my stream')
			//set user stream
			self.obj.stream = stream;

			//send stream
	  		OpenPath.socket.emit("stream", self.obj);

	  		//render video
			self.video.render();

		},
		function(err) {
			console.log('Failed to get local stream' ,err);
		});
	}
};
/**
 * getMyLocation, send to socket
 */
OpenPath.User.prototype.getMyLocation = function(){
	var self = this;

	function setLocation(position){
		self.obj.location.coords.latitude = position.coords.latitude;
		self.obj.location.coords.longitude  = position.coords.longitude;

		console.log("got my location - Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude );

		//send location
	 	OpenPath.socket.emit("location", self.obj );

	 	//re-render video
		self.video.render();
	}
	//location error
	function showLocationError(error){
		switch(error.code){
			case error.PERMISSION_DENIED:
				console.log("User denied the request for Geolocation.");
			break;
			
			case error.POSITION_UNAVAILABLE:
				console.log("Location information is unavailable.");
			break;
			case error.TIMEOUT:
				console.log("The request to get user location timed out.");
			break;
			case error.UNKNOWN_ERROR:
				console.log("An unknown error occurred.");
			break;
		}
	}
	//get location
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition( setLocation, showLocationError );
	}else{
		console.log("Geolocation is not supported by this browser.");
	}
};
/**
 * check if I'm presenter, return a callback function
 */
OpenPath.User.prototype.checkIfPresenter = function( done ){
	var self = this;
	//create modal instance
	var presenterMondal = new OpenPath.Model();
	presenterMondal.url = '/presenter/'+this.obj.room_id+'/'+this.obj.email;
	//get data
	presenterMondal.get();
	presenterMondal.got = function( isPresenter ){
		self.isPresenter = isPresenter;
		done(isPresenter);
	};
};
