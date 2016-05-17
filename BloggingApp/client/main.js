import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//declare a collection to hold the blog posts
Posts = new Mongo.Collection('posts');

Template.blog.helpers({
  postList: function() {
  	return Posts.find();
  }
});

Template.blog.events({
	"submit .addBlogPost": function(event) {
	//grab form data
	var title = event.target.blogTitle.value;
	var text = event.target.blogText.value;
	//TODO: correct this
	var user = 'Test User'

	Meteor.call('addPost', title, text);
  },
});
