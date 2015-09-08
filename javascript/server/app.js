var restify = require('restify');
var fs = require('fs');


var server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

server.get('/collections', function (req, res, next) {
  var data = fs.readFileSync("./data/collections.json", "utf8");
  //console.log(JSON.parse(data));
  res.send(JSON.parse(data));
  return next();
});

server.get('/manifest', function(req, res, next){
  var data = fs.readFileSync("./data/config.json", "utf8");
  res.send(JSON.parse(data));
  return next();
})
server.get("/patientStudy/:patientId",function(req, res, next){
  var data = fs.readFileSync("./data/patientsCollections.json", "utf8");
  var resData = [];
  console.log(req.params.patientId)
  var data = JSON.parse(data)
  //console.log(JSON.parse(data));
  //console.log(data)
  for(var i in data){
    if(data[i].PatientID == req.params.patientId)
      resData.push(data[i]);
  }

  res.send(resData)

  return next();

});

server.get('/patients/:collectionId', function (req, res, next) {
  var data = fs.readFileSync("./data/patients.json", "utf8");
  var resData = [];
  console.log(req.params.collectionId)
  var data = JSON.parse(data)
  //console.log(JSON.parse(data));
  //console.log(data)
  for(var i in data){
    if(data[i].Collection == req.params.collectionId)
      resData.push(data[i])
  }

  res.send(resData)

  return next();
});

server.listen(3001, function () {
  console.log('%s listening at %s', server.name, server.url);
});
