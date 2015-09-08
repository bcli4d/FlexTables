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

var _tableData;
var DataStore = Reflux.createStore({
  init: function(){
    this.listenTo(Actions.rowClick, this.onRowClick);
  },
  getData: function(){
    return _tableData;
  },
  onRowClick: function(config, params){
    var self = this;
    //Load Data using config
    var url = config.dataUrl;
    console.log(config["params"])
    if(params){

      console.log(params)
      console.log(params[config["params"]])
      url = url+params[config.params]
    }
    console.log(url)
    jQuery.get(url, function(data){
      console.log(data)
      _tableData = data;
      self.trigger(data);
    })
    //Trigger update
  }
})

var _config = {}

var init = function(){
  jQuery.get("http://localhost:3001/manifest", function(data){
    _config = data;
    Actions.rowClick(data.path[0])

  })
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

    /*
    jQuery.get("http://localhost:3001/collections", function(data){
      console.log(data);
      self.setState({data: data});
    })
    */
  },

  rowGetter: function(i){
    //console.log(this.state.data[i])
    return (this.state.data[i]);
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
        onRowClick={function(event, index){
            //console.log(self.state.data[index])
            var pathState  = self.state.pathState;
            pathState++;
            params = self.state.data[index]
            Actions.rowClick(_config.path[pathState], params)
            self.setState({pathState: pathState});
            /*
          jQuery.get("http://localhost:3001/patients/"+self.state.data[index].Collection, function(data){
            //console.log(data);
            self.setState({data: data});
          })
          */
        }}
      >
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
