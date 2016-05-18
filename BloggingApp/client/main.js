import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//declare a collection to hold the blog posts
Posts = new Mongo.Collection('posts');

//hold on to post for edit
var editPost = new ReactiveVar;

//Routes
Router.route('/', function () {
  this.render('blog');
});

Router.route('/blog');
Router.route('/addNewPost');
Router.route('/myPosts');
Router.route('/editMyPost');

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

Template.editMyPost.helpers({
  	editTitle: function() {
	  	//posts displayed with newest post on top
	  	return editPost.title;
  	},

  	editText: function() {
	  	//posts displayed with newest post on top
	  	return editPost.text;
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

		return false;
  	}
});

Template.myPosts.events({
	"click .delete-my-post": function(event) {

		if(confirm('Delete Post?')){
  			Meteor.call('deletePost', this._id);
  		}
  	},

  	"click .edit-my-post": function(event) {
  		//get the post and assign it to the variable
  		editPost = Posts.findOne({_id: this._id}, {});
  		//go to editMyPost template
		Router.go('editMyPost');
  	}
});

Template.editMyPost.events({
	"submit .save-my-edit": function(event) {
		//collect values
		editPost.title = event.target.editTitle.value;
		editPost.text = event.target.editText.value;

		Meteor.call('editPost', editPost);

		editPost = null;

  		Router.go('myPosts');
  		
  		return false;
  	},

  	"click .cancel-my-edit": function(event) {
		Router.go('myPosts');

		return false;
  	}
});