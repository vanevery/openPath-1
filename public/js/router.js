'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Router
 * @author jamiegilmartin@gmail.com
 * @description a front end router to hide / show different views
 */
OpenPath.Router = {
	init : function(){

		//all pages & all views 
		this.pages = document.querySelectorAll('.page');
		this.views = document.querySelectorAll('.view');

		//individual pages
		this.videos = document.querySelector('#videos');
		this.invite = document.querySelector('#invite');
		this.events = document.querySelector('#events');
		this.profile = document.querySelector('#profile');

		//individual views ( || sub pages )
		this.inviteView = document.querySelector('#inviteView');
			//profile
		this.myProfile = document.querySelector('#myProfile');
		this.editProfile = document.querySelector('#editProfile');
		this.myPath = document.querySelector('#myPath');
		this.notifications = document.querySelector('#notifications');
		this.settings = document.querySelector('#settings');
			//events
		this.upcomingEvents = document.querySelector('#upcomingEvents');
		this.nearbyEvents = document.querySelector('#nearbyEvents');
		this.addNewEvent = document.querySelector('#addNewEvent');
		this.inviteToEvent = document.querySelector('#inviteToEvent');


		//console.log(this.pages,this.views)

		
		this.bindRoutes();
	},
	bindRoutes : function(){
		var self = this;

		//links to checkRoutes on
		this.routes = document.querySelectorAll('.route');

		/**
		 * @class route
		 * @description small helper class to add event listener
		 */
		function route( route ){
			route.addEventListener('click',function(e){
				//remove active from btns
				for(var i=0;i<self.routes.length;i++){
					self.routes[i].classList.remove('active');
				}
				//add active to btn
				route.classList.add('active');
				self.checkRoute( route.getAttribute('href') );//not working on first click cuz....
			},false);
		}
		//make route instances
		for(var i=0;i<this.routes.length;i++){
			new route( this.routes[i] );
		}
	},
	checkRoute : function( route ){
		//hide all
		this.hideAll();

		console.log(route, 'router', window.location.hash.split('#/')[1]);

		var route = route ? route.split('#/')[1] : window.location.hash.split('#/')[1];

		if(route){
			var id = route.split('/')[1];
			route = route.split('/')[0];
		}
		


		/**
		 * all our routes switch
		 */
		switch(route){
			case 'videos':
				this.showVideos();
			break;
			case 'invite':
				this.showInvite();
			break;
			case 'events':
				this.showEvents();
			break;
			case 'nearby-events':
				this.showNearbyEvents();
			break;
			case 'add-new-event':
				this.showAddNewEvent();
			break;
			case 'edit-event':
				this.showEditEvent( id );
			break;
			case 'invite-to-event':
				this.showInviteToEvent( id );
			break;
			case 'profile':
				this.showProfile();
			break;
			case 'edit-profile':
				this.showEditProfile();
			break;
			case 'myPath':
				this.showMyPath();
			break;
			case 'notifications':
				this.showNotifications();
			break;
			case 'settings':
				this.showSettings();
			break;
			default:
				this.showVideos();
			break;
		}
	},
	hideAll : function(){
		//pages
		for(var i=0;i<this.pages.length;i++){
			this.pages[i].style.display = 'none';
		}
		//views
		for(var j=0;j<this.views.length;j++){
			this.views[j].style.display = 'none';
		}
	},
	showVideos : function(){
		this.videos.style.display = 'block';
	},
	showInvite : function(){
		this.invite.style.display = 'block';
		this.inviteView.style.display = 'block';

		var inviteMsg = document.getElementById('inviteMsg');
		//compile template
		var source = document.getElementById('addParticipantsTemplate').innerHTML;
		var template = Handlebars.compile(source);

		inviteMsg.innerHTML = template();
	},
	showEvents :  function(){
		var self = this;
		this.events.style.display = 'block';
		this.upcomingEvents.style.display = 'block';

		//create view instance
		var upcomingEventsView = new OpenPath.View();
		upcomingEventsView.url = '/events';
		//get data
		upcomingEventsView.get();


		var content = this.upcomingEvents.getElementsByClassName('content')[0];
		//compile template
		var source = document.getElementById('upcomingEventsTemplate').innerHTML;
		var template = Handlebars.compile(source);


		upcomingEventsView.got = function(data){
			//console.log('upcomingEventsView got', data );

			//add data to template
			content.innerHTML = template( data );

			var events = content.getElementsByClassName('event');
			for(var i=0; i<events.length; i++){
				var mapwrap = events[i].getElementsByClassName('mapWrap')[0];
				OpenPath.Utils.renderMap(mapwrap, mapwrap.dataset.latitude, mapwrap.dataset.longitude, mapwrap.dataset.reference, mapwrap.dataset.formattedaddress );
			}


			//rebind routes
			self.bindRoutes();
		};
	},
	showNearbyEvents :  function(){
		this.events.style.display = 'block';
		this.nearbyEvents.style.display = 'block';
	},
	showAddNewEvent :  function(){
		this.events.style.display = 'block';
		this.addNewEvent.style.display = 'block';

		/**
		 * autocompleteLocationInput
		 */
		function autocompleteLocationInput(){

			var locationInput = document.getElementById("location"),
				longitudeInput = document.getElementById("longitude"),
				latitudeInput = document.getElementById("latitude"),
				referenceInput = document.getElementById("reference"),
				formattedAddressInput = document.getElementById("formattedAddress");

			var autocomplete = new google.maps.places.Autocomplete(locationInput);
			
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				//infowindow.close();
				
				var place = autocomplete.getPlace();
				if (!place.geometry) {
					// Inform the user that a place was not found and return.
					alert('location not found')
					return;
				}else{
					console.log(place)
					longitudeInput.value = place.geometry.location.lng();
					latitudeInput.value = place.geometry.location.lat();
					referenceInput.value = place.reference;
					formattedAddressInput.value = place.formatted_address;
					console.log(place.reference);	
				}
			});
		}

		autocompleteLocationInput();
		
		/**
		 * grade level //TODO
		 */
		var gradelevelsArr = [];
		/*
		this.form.find('input:checkbox[name=gradelevel]:checked').each(function(){
			gradelevelsArr.push( $(this).val() );
		});
		*/
	},
	showEditEvent : function(){
		this.events.style.display = 'block';
		this.addNewEvent.style.display = 'block';
	},
	showInviteToEvent : function( id ){
		var self = this;
		this.invite.style.display = 'block';
		this.inviteView.style.display = 'block';

		//create view instance
		var inviteToEventView = new OpenPath.View();
		inviteToEventView.url = '/events/'+id;
		//get data
		inviteToEventView.get();

		var inviteMsg = document.getElementById('inviteMsg');
		//compile template
		var source = document.getElementById('inviteToEventTemplate').innerHTML;
		var template = Handlebars.compile(source);

		inviteToEventView.got = function(data){
			console.log('inviteToEventView got', data );

			inviteMsg.innerHTML = template( data );
		};
	},
	showProfile : function(){
		this.profile.style.display = 'block';
		this.myProfile.style.display = 'block';
	},
	showEditProfile : function(){
		this.profile.style.display = 'block';
		this.editProfile.style.display = 'block';
	},
	showMyPath : function(){
		this.profile.style.display = 'block';
		this.myPath.style.display = 'block';
	},
	showNotifications : function(){
		this.profile.style.display = 'block';
		this.notifications.style.display = 'block';
	},
	showSettings : function(){
		this.profile.style.display = 'block';
		this.settings.style.display = 'block';
	}
};