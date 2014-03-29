var Utils = require('../utils/utils');


/**
 * init socketHandler
 * @see http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/
 */
module.exports.start = function( io ){
	var self = this;
	var connected_users = [];
	/**
	 * socket.io
	 */
	io.sockets.on('connection', function (socket) {
		console.log("We have a new socket client: " + socket.id);

		socket.on('adduser', function(user) {
			//TOdO if(socket.user)
			
			//save user & room to socket session
			socket.user = user;
			socket.room = user.room_id;

			//add user to global user list
			connected_users.push(user);

			//uniquify users
			//connected_users = Utils.uniqueArray(connected_users);
			console.log('connected_users',connected_users);

			//var users = [];
			//for (var i  = 0; i < io.sockets.clients().length; i++) {
			//	console.log("loop: " + i, io.sockets.clients()[i].user);
			//	users.push(io.sockets.clients()[i].user)
			//}

			//join room
			socket.join(user.room_id);
			// echo to client they've connected
			socket.emit('updatechat', 'SERVER', 'you have connected to room #'+user.room_id, connected_users);

			var name = user.name ? user.name : user.email;
			// echo to room that a person has connected to their room
			socket.broadcast.to(user.room_id).emit('updatechat', 'SERVER', name + ' has connected to this room.', connected_users);

		});

		// when the client emits 'sendchat', this listens and executes
		socket.on('sendchat', function (user, msg) {
			// we tell the client to execute 'updatechat' with 2 parameters
			io.sockets.in( user.room_id ).emit('updatechat', socket.user, msg, connected_users);
		});


		/**
		 * on peer_id
		 * @description : the start of the video program
		 */
		socket.on('peer_id', function(user) {
			console.log("Received: 'peer_id' " + user.email, user.peer_id);

			// we tell the client to execute 'peer_id' with 1 parameter
			io.sockets.in( user.room_id ).emit('peer_id', user );
		});
		
		/**
		 * on location
		 */
		socket.on('location', function(user) {
			console.log("Received: 'location' " + user.email, user.location);

			// we tell the client to execute 'location' with 1 parameter
			io.sockets.in( user.room_id ).emit('location', user );
		});
		
		/**
		 * on stream
		 */
		socket.on('stream', function(user) {
			console.log("Received: 'stream' " + user.email, user.stream);

			// we tell the client to execute 'stream' with 1 parameter
			io.sockets.in( user.room_id ).emit('stream', user );
		});
		

		/**
		 * on disconnect
		 */
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
			// remove the username from global usernames list
			//delete usernames[socket.username];

			var user_index = connected_users.indexOf(socket.user);
			if (user_index > -1) {
				console.log('removing user', socket.user);
   				connected_users.splice(user_index, 1);
   				console.log(connected_users)
			}

			// update list of users in chat, client-side
			//io.sockets.emit('updateusers', usernames);

			// echo globally that this client has left
			//socket.broadcast.emit('updatechat', 'SERVER', socket.user.email + ' has disconnected',connected_users);
			
			var msg = socket.user.email + ' has disconnected from room # ' +  socket.user.room_id;

			io.sockets.in( socket.user.room_id ).emit('updatechat', socket.user, msg, connected_users);
			socket.leave( socket.user.room_id );
		});
		

	});
};


			