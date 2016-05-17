import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//declare a collection to hold the blog posts
Posts = new Mongo.Collection('posts');

Template.blog.helpers({
  postList: function() {
  	//posts displayed with newest post on top
  	return Posts.find({},{sort: {created: -1}});
  }
});

Template.blog.events({
	"submit .add-blog-post": function(event) {
	//grab form data
	var title = event.target.blogTitle.value;
	var text = event.target.blogText.value;

	Meteor.call('addPost', title, text);

	return false;
  },

  "click .delete-post": function(event){
  	//confirm delete
  	if(confirm('Delete Post')){
  		Meteor.call('deletePost', this._id);
  	}

  	return false;
  }

});
