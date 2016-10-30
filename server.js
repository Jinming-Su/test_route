var http = require("http");
var url = require("url");
var fs = require('fs');
var io;
var contest_list = ['contest1', 'contest2'];
var contest1_list = [];
var contest2_list = [];

function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;

    fs.readFile(__dirname + route(pathname), function(err, data) {
      if(err) {
        response.writeHead(500);
        response.end();
      }
      response.writeHead(200);
      response.end(data);
    });
  }

  var tmp = http.createServer(onRequest);

  tmp.listen(1234);
  console.log("Server has started.");
  io = require('socket.io')(tmp);
  io.on('connection', function(socket) {
    socket.on('contest1', function (data) {
      socket.name = data.name;
      for(var i = 0;i < 2;i ++) {
        socket.leave(contest_list[i]);
        for(var j = 0;j < contest1_list.length;j++) {
          if(contest1_list[j] == socket.name) {
            contest1_list.splice(j, 1);
          }
        }
      }
      socket.join('contest1');
      console.log(socket.name + ' joins contest1');
      contest1_list.push(socket.name);
      show();
      io.sockets.in('contest1').emit('res', 'contest1 should see this');
    });
    socket.on('contest2', function (data) {
      socket.name = data.name;
      for(var i = 0;i < 2;i ++) {
        socket.leave(contest_list[i]);
        for(var j = 0;j < contest2_list.length;j++) {
          if(contest2_list[j] == socket.name) {
            contest2_list.splice(j, 1);
          }
        }
      }
      socket.join('contest2');
      console.log(socket.name + ' joins contest2');
      contest2_list.push(socket.name);
      show();
      io.sockets.in('contest2').emit('res', 'contest2 should see this');
    });
    socket.on('chat', function(data) {
      io.sockets.in(socket.name).emit('show', data);
    });
  });
}

function show() {
  console.log("contest1_list: ");
  for(var i = 0;i < contest1_list.length; i++) {
    console.log(contest1_list[i]);
  }
  console.log("contest2_list: ");
  for(var i = 0;i < contest2_list.length; i++) {
    console.log(contest2_list[i]);
  }
}

exports.start = start;
