
原始：
https://201605111151fei.wilddogio.com/news.json?orderBy=\"timestamp\"&limitToLast=10&print=pretty&callback=JSON_CALLBACK

https://201605111151fei.wilddogio.com/news.json?orderBy=\"timestamp\"&startAt="+$scope.lasttimestamp+"&limitToLast="+($scope.pageindex+1)*10+"&print=pretty&callback=JSON_CALLBACK

https://201605111151fei.wilddogio.com/news/"+newsId+".json?callback=JSON_CALLBACK



=====初始化====
http://lvyafei.jsp.jspee.com.cn/FSComponentCrawler/news/getNewsDataForPage?ptimestamp=0&ptype=loadmore

=====loadmore====
http://lvyafei.jsp.jspee.com.cn/FSComponentCrawler/news/getNewsDataForPage?ptimestamp=1466250529000&ptype=loadmore

=====loadnew=====
http://lvyafei.jsp.jspee.com.cn/FSComponentCrawler/news/getNewsDataForPage?ptimestamp=1466250529000&ptype=loadnew

=====查询=====
http://lvyafei.jsp.jspee.com.cn/FSComponentCrawler/news/getNewsById?pid=23