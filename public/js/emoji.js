var sumGif = []
for(var i = 1; i < 70; i++){
  sumGif.push(i+".gif")
}
var sum = ""
for (var i = 1; i < sumGif.length; i++) {
  sum += '<img src="../img/emoji/'+sumGif[i]+'"/>'
}
$(".upEmoji").click(function(){
    $(".emoImg").html(sum)
    $(".emoImg").slideToggle()
})
$(".emoImg").click(function(){
  $(".emoImg").slideToggle()
})
