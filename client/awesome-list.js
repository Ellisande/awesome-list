People = new Meteor.Collection('people');

Template.contents.helpers({
  topPeople: function(){
    return People.find();
  }
});
