var ws = io("ws://127.0.0.1:8888")

var userName = ""

$(".connect").click(function(){
  var nickname = $(".nickname").val()
  var userData = {
    "id":nickname,
    "nickname":nickname
  }
  //if( nickname != '' ){
    ws.emit("login", userData)
//  }else {
  //  alert("请输入昵称！")
  //}
})

ws.on("confirmLogin",function(data){
  if(data.isNew){
    $(".container").css("display", "block")
    $(".inputName").css("display", "none")
    userName = data.userName
    $(".chatPane").append('<li style="text-align:center;color:gray;font-size:12px">欢迎加入聊天室</li>')
  }else {
    alert("改昵称已被占用！")
  }
})

ws.on("login", function(data){
  var temp = $("#listTemp").html()
  var names = []
	for(var user in data.onlineUser){
		names.push({
			nickname: user
		})
	}
  $(".chatPane").append('<li style="text-align:center;color:gray;font-size:12px">'+data.userInfo.nickname+'加入聊天室</li>')
  $(".userList").html(Mustache.render(temp, names))
  $("#onlinecount").html(data.onlineCount)
})

$(".send").click(function(){
  var color = $('input[name=putColor]').val()
  var temp = $(".inputConnect").val()
  $(".chatPane").append('<li style="margin-left:10px;font-size:15px;">'+userName+'说：'+temp+'</li>')
  $(".chatPane li").last().css("color",color)
  ws.emit("sendMsg",userName,temp)
  ws.emit("fontColor", color)
  $(".inputConnect").val("")
})

ws.on("sendMsg", function(userName,temp){
  $(".chatPane").append('<li style="margin-left:10px;font-size:15px">'+userName+'说：'+temp+'</li>')
})

ws.on("fontColor", function(color){
  $(".chatPane li").last().css("color",color)
})

$(".emoImg").click(function(e){
  var src = $(e.target).attr("src")
  $(".chatPane").append('<li style="margin-left:10px;font-size:15px">'+userName+'说：<img src="'+src+'"/></li>')
  ws.emit("img",src,userName)
})
ws.on("img",function(src,userName){
  $(".chatPane").append('<li style="margin-left:10px;font-size:15px">'+userName+'说：<img src="'+src+'"/></li>')
})

ws.on("logout", function(data){
  var temp = $("#listTemp").html()
  var names = []
	for(var user in data.onlineUser){
		names.push({
			nickname: user
		})
	}
  var nickNames = data.onlineUser
  $(".chatPane").append('<li style="text-align:center;color:gray;font-size:12px">'+data.outUser.nickname+'离开聊天室</li>')
  $(".userList").html(Mustache.render(temp, names))
  $("#onlinecount").html(data.onlineCount)
})
