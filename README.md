Demo: test_route

* 数据表  
id int  
contest_id int  
user_id int  
content int  
created_time timestamp  

* 设计思路  
(1)需要启动nodehttp服务器  
(2)每个比赛相关的页面加入一段js代码,告诉后端自己的数据emit connect（userid, contest_id, content）  
(3)服务端收到数据有个connect的监听事件，被客户端触发之后，先将客户端从所有的contest离开，然后把他加入contest_id指定的频道，广播信息io.sockets.emit('show');可能需要在服务端存在的数据：所有的contest，username  
(4)之后就可以开始聊天了，客户端emit(say),服务端emit(show)  
