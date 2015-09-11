var Reflux = require('reflux');
var Actions = require('../actions/Actions.jsx');
var jQuery = require('jquery');
var _tableData;

var DataStore = Reflux.createStore({
  init: function(){
    this.listenTo(Actions.rowClick, this.onRowClick);
  },
  getData: function(){
    return _tableData;
  },
  onRowClick: function(url){
    var self = this;
    console.log(url)

    jQuery.get(url, function(data){
      console.log(data)
      _tableData = JSON.parse(data);
      self.trigger(data);
    })
    //Trigger update
  }
})

module.exports = DataStore;

