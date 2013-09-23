OpenPath = window.OpenPath || {};

OpenPath.EditUserProfileView = Backbone.View.extend({
    tagName:"div",
    className:"editView",
	template:$("#editUserProfileTemplate").html(),
	initialize : function(){

        this.render();
	},
	render:function () {
        var tmpl = _.template(this.template);
        
        this.$el.html(tmpl(this.model.toJSON()));

        
		//set up and handle form submission
		this.setForm();

        return this;
    },
    /**
     * custom form setup & submission - unbackbone way
     */
    setForm : function(){
    	var self = this;
    	this.form = this.$el.find('form');

    	//populate select ele with correct option selected
		this.$el.find("form select.gradelevel > option").each(function() {
			if(this.value === self.model.grade){
				$(this).attr('selected','selected');
			}
		});


    	//submit and validate
		this.form.validate({
			submitHandler: function(form) {
				var firstName = self.form.find('.firstName').val(),
					lastName = self.form.find('.lastName').val(),
					//gradelevel = $(this).find('.gradelevel').val(),
					//interests = $(this).find('.interests').val(),
					//colearners = $(this).find('.colearners').val(),
					data = {
						name : {first: firstName, last : lastName}//,
						//grade: gradelevel,
						//interests : interests.split(',').join(', ')
					};
				self.model.set(data,{
			        success: function (model) {
			            console.log('save',	model.toJSON());
			        },
			        error: function(err){
			        	 console.log('error save',	err);
			        }
			    });
				return false;
			}
		});
    }
});