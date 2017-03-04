var express = require('express')
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

app.get('/', function(req, res){
  res.send('<p>Welcome</p>')
});

app.use(express.static('./public'))

server.listen(process.env.PORT || 8888, function(){
  console.log("listening：127.0.0.1:8888/index.html");
});

var onlineUser = {},
    onlineCount = 0

io.on("connection", function(socket){
  console.log("a uesr connected");
  socket.on("login",function(data){
    var isNew = false
    socket.name = data.id
    if(!onlineUser.hasOwnProperty(socket.name)){
      isNew = true
      onlineUser[data.id] = data.nickname
      onlineCount++
    }
    socket.emit("confirmLogin",{userName:data.nickname, isNew:isNew})
    io.emit("login",{onlineUser:onlineUser,onlineCount:onlineCount,userInfo:data})
  })

  socket.on("fontColor", function(color){
    socket.broadcast.emit("fontColor", color)
  })
  socket.on("sendMsg", function(userName,temp){
    socket.broadcast.emit("sendMsg",userName,temp)
  })
  socket.on("img", function(src, nickname){
    socket.broadcast.emit("img", src, nickname)
  })

  socket.on("disconnect",function(){
    if(onlineUser.hasOwnProperty(socket.name)){
      //退出用户的信息
      var outUser = {id:socket.name,nickname:socket.name}
      //从在线的用户中删除下线用户
      delete onlineUser[socket.name]
      onlineCount--
      io.emit("logout",{onlineUser:onlineUser,onlineCount:onlineCount,outUser:outUser})
      console.log(socket.name+"退出了聊天室");
    }
  })

})
