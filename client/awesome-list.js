Awesome = new Meteor.Collection('awesome');

Template.contents.helpers({
  people: function () {
    return Awesome.find({}, {sort: {score: -1}, limit: 5});
  }
});

Template.contents.events({
  'click .addPerson': function () {
    var newName = $('#newPerson').val();
    Awesome.insert({name: newName, score: 0});
    $('#newPerson').val('');
  },
  'click .add': function(){
    Awesome.update({_id: this._id}, {$set: {score: ++this.score}});
  },
  'click .subtract': function(){
    Awesome.update({_id: this._id}, {$set: {score: --this.score}});
  },
  'click .remove': function(){
    Awesome.remove({_id: this._id});
  }
});
