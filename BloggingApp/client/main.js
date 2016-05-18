import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//declare a collection to hold the blog posts
Posts = new Mongo.Collection('posts');


//Routes
Router.route('/', function () {
  this.render('blog');
});

Router.route('/blog');
Router.route('/addNewPost');
Router.route('/myPosts');

//global helper methods
//convert date to viewer friendly format
Template.registerHelper('glbConvertDate', function(date){
	var options = {
		    year: "numeric", month: "short",
		    day: "numeric", hour: "2-digit", minute: "2-digit"
		};

  		return date.toLocaleDateString("en-US", options);
})


//template helper methods
Template.blog.helpers({
	//posts displayed with newest post on top
	postList: function() {
		return Posts.find({},{sort: {created: -1}});
	},

	//show edit and delete buttons for post owner only
	isPostOwner: function(userId){
	  	if (Meteor.userId() == userId) {
	  		return true;
	  	}
	  	return false;
		}
});

Template.myPosts.helpers({
  	getMyPosts: function() {
	  	//posts displayed with newest post on top
	  	return Posts.find({userId: Meteor.userId()},{sort: {created: -1}});
  	}
});

Template.addNewPost.events({
	"submit .add-blog-post": function(event) {

		//grab form data
		var title = event.target.blogTitle.value;
		var text = event.target.blogText.value;

		//validate on client side that the user is logged in and then
		//call server method
		if(Meteor.userId()){
			Meteor.call('addPost', title, text);

			//reset textboxes
			event.target.blogTitle.value = "";
			event.target.blogText.value = "";

			//redirect back to the blog page
			Router.go('blog');
		}
		else{
			//TODO: error message
		}

		return false;
  	}
});

Template.myPosts.events({
	"click .delete-my-post": function(event) {

		if(confirm('Delete Post?')){
  			Meteor.call('deletePost', this._id);
  		}

  		return false;
  	},

  	"click .edit-my-post": function(event) {

		return false;
  	}
});

/*

"click .delete-post": function(event){
  	if(confirm('Delete Post?')){
  		Meteor.call('deletePost', this._id);
  	}

  	return false;
  },

  "click .edit-post": function(event){
  	

  	return false;
  }

*/
