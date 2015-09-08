var React = require('react');

var FixedDataTable = require('fixed-data-table');

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var jQuery = require('jquery');
var ColumnGroup = FixedDataTable.ColumnGroup;
var Reflux = require('reflux')

var Actions = Reflux.createActions([
  "init",
  "rowClick"
]);

var _config = {};
var ConfigStore = Reflux.createStore({
  init: function(){
    this.listenTo(Actions.init, this.onInit);
  },
  onInit: function(){
    var self = this;
    jQuery.get("index.php/getConfig", function(data){
      _config = JSON.parse(data);
      console.log(_config);
      self.trigger(data);
    })
  },
  getConfig: function(){
    return _config;
  }
})

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


var init = function(){
  //jQuery.get("http://localhost:3001/manifest", function(data){
    //_config = data;
    Actions.init();
    Actions.rowClick("index.php/getData?pathState=0");
    console.log(ConfigStore.getConfig());
  //})
}

init();

var WIDTH = 1200;


var TableColumns = React.createClass({
  render: function(){

    return(
      {Columns}
    )

  }
})

var InitTable = React.createClass({
  listenables: Actions,
  getInitialState: function(){
    return {pathState: 0};
  },
  onData: function(){
    var self = this;
    var data = DataStore.getData();
    console.log(data)
    if(data)
      self.setState({data: data});
  },
  componentDidMount: function(){
    var self = this;
    self.unsubscribe = DataStore.listen(self.onData)


  },

  rowGetter: function(i){
    //console.log(this.state.data[i])
    return (this.state.data[i]);
  },
  nextPath: function(event, index){
    var self  = this;
    var pathState  = self.state.pathState;
    var config = ConfigStore.getConfig();
    self.setState({data: null});

    pathState++;
    params = self.state.data[index];

    var reqParams = config[pathState]["params"];

    Actions.rowClick("index.php/getData?pathState="+ pathState+ "&" + reqParams + "="+ params[reqParams]);
    this.setState({pathState: pathState});
  },
  render: function(){
    var self = this;
    if(self.state.data){

      var data = self.state.data;
      var keys = [];
      for(var i in data[0]){
        keys.push(i)
      }
      var nColumns = keys.length;
      var Columns = keys.map(function(column){
        return(


          <Column
            label={column}
            width={WIDTH/keys.length}
            dataKey={column}

          />
        )
      });
      return(
      <Table
        rowHeight={50}
        rowGetter={self.rowGetter}
        rowsCount={self.state.data.length}
        width={WIDTH}
        height={400}
        headerHeight={50}
        onRowClick={self.nextPath}>


      {Columns}
      </Table>
    )
    } else {
      return(
        <h4>Loading...</h4>
      )
    }

  }
});

var App = React.createClass({
  render: function(){
    return(
      <div id="whoosh">
        <h1>Whoosh Tables</h1>
        <div id="whooshTable">
          <InitTable/>
        </div>
      </div>
    )
  }
})

React.render(
  <App />,
  document.getElementById('app')
);
