People = new Meteor.Collection('people');

Template.contents.helpers({
  topPeople: function () {
    return People.find({}, {sort: {score: -1}});
  }
});

Template.contents.events({
  'click #addPerson': function () {
    var newName = $('#newPerson').val();
    People.insert({name: newName, score: 0});
    $('#newPerson').val('');
  },
  'click .add': function(){
    People.update({_id: this._id}, {$set: {score: ++this.score}});
  },
  'click .subtract': function(){
    People.update({_id: this._id}, {$set: {score: --this.score}});
  },
  'click .remove': function(){
    People.remove({_id: this._id});
  }
});
