'use strict';

var OpenPath = window.OpenPath || {};

OpenPath = {
	init : function(){
		console.log('OpenPath init');



		//dom vars
		var intro = document.getElementById('intro'),
			home = document.getElementById('home');


		if( home ){
			this.peerHandler();
		}else{
			this.intro();
		}
	},
	intro : function(){
		var toggles = document.getElementsByClassName('toggle'),
			signupBtn = document.getElementById('signupBtn'),
			loginBtn = document.getElementById('loginBtn');

		function toggle( className ){
			for(var i=0;i<toggles.length;i++){
				if(toggles[i].classList.contains(className)){
					toggles[i].style.display = 'block';
				}else{
					toggles[i].style.display = 'none';
				}
				
			}
		}
		//events
		loginBtn.addEventListener('click',function(){
			toggle('login');
		},false);
		signupBtn.addEventListener('click',function(){
			toggle('signup');
		},false);

	},
	peerHandler : function(){
		var self = this;

		this.peer = new Peer({key: 'w8hlftc242jzto6r'}); //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
		this.peer_id = null;


		// Get an ID from the PeerJS server		
		this.peer.on('open', function(id) {
		  console.log('My peer ID is: ' + id);
		  self.peer_id = id;

		  self.socketHandler();
		  self.getUserMedia();
		});

		this.peer.on('call', function( incoming_call ) {
			console.log("Got a call!");
			incoming_call.answer(self.my_stream); // Answer the call with our stream from getUserMedia
			incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
				// And attach it to a video object
				var ovideoElement = document.getElementById('othervideo');
				ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
				ovideoElement.play();
			});
		});	
			
	},
	socketHandler : function(){
		var self = this;
		var socket = io.connect('http://localhost');
		socket.on('userConnected', function (data) {
			console.log('userConnected',data.user.email);
		});
		socket.on('userDisconnected', function (data) {
			console.log('userDisconnected',data.user.email);
		});




		// When we connect, assuming we have a peer_id, send it out
		socket.on('connect', function() {
			console.log("Connected");

			// When we connect, if we have a peer_id, send it out	
			if (self.peer_id != null) {
				console.log("peer id is not null, sending it");
				socket.emit("peer_id",self.peer_id);
			}
		});

		// Receive other folks peer_ids
		socket.on('peer_id', function (data) {
			console.log("Got a new peer: " + data);

			
			// Call them with our stream, my_stream
			console.log("Calling peer: " + data);						
			var call = self.peer.call(data, self.my_stream);
			
			// After they answer, we'll get a 'stream' event with their stream	
			call.on('stream', function(remoteStream) {
				console.log("Got remote stream");
				document.getElementById('othervideo').src = window.URL.createObjectURL(remoteStream) || remoteStream;
			});
		});		

	},
	getUserMedia : function(){
		var self = this;
		this.my_stream = null;

		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{video: true, audio: true},
				function(stream) {
						self.my_stream = stream;
						var videoElement = document.getElementById('myvideo');
						videoElement.src = window.URL.createObjectURL(stream) || stream;
						videoElement.play();
				},
				function(err) {
						console.log('Failed to get local stream' ,err);
				}
			);
		}
	}
};


window.onload = function(){
	OpenPath.init();
};