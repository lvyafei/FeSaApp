angular.module('starter.webapi', [])
.factory('webapi',function($http,$window) {
	var _hosts="http://lvyafei1.jsp.jspee.com.cn";
	//var _hosts="http://localhost:9091";
	var _crawler_gettoken="/crawler/oauth/token?grant_type=password&client_id=restapp&client_secret=restapp&username=fsmobile&password=fsmobile@20160704";
	var _crawler_refreshToken="/crawler/oauth/token?grant_type=refresh_token&client_id=restapp&client_secret=restapp&refresh_token=";
	
	var _portal_gettoken="/portal/oauth/token?grant_type=password&client_id=restapp&client_secret=restapp&username=fsmobile&password=fsmobile@20160704";
	var _portal_refreshtoken="/portal/oauth/token?grant_type=refresh_token&client_id=restapp&client_secret=restapp&refresh_token=";
	return {
		/**全局变量**/
		hosts:"http://lvyafei1.jsp.jspee.com.cn",
		//hosts:"http://localhost:9091",
		wilddog:"https://201605111151fei.wilddogio.com",

		getAccessTokenCrawler:function(){
			var loctoken=$window.localStorage["loctoken_crawler"];
			var locexpires=$window.localStorage["locexpiration_crawler"];
			var curtime=(new Date()).getTime();
			if((loctoken==null||loctoken=="")||parseInt(locexpires)<curtime){//获取token
				$.ajax({
					type:'GET',
					url:_hosts+_crawler_gettoken,
					async:false,
					success:function(data,header,config,status){
						$window.localStorage["loctoken_crawler"]=data.value;
						$window.localStorage["locexpiration_crawler"]=data.expiration;
						$window.localStorage["locrefresh_crawler"]=data.refreshToken.value;
					},
					error:function(data,header,config,status){
						console.log("获取token错误");
					}
				});
			}
		},
		getAccessTokenPortal:function(){
			var loctoken=$window.localStorage["loctoken_portal"];
			var locexpires=$window.localStorage["locexpiration_portal"];
			var curtime=(new Date()).getTime();
			if((loctoken==null||loctoken=="")||parseInt(locexpires)<curtime){//获取token
				$.ajax({
					type:'GET',
					url:_hosts+_portal_gettoken,
					async:false,
					success:function(data,header,config,status){
						$window.localStorage["loctoken_portal"]=data.access_token;
						$window.localStorage["locexpiration_portal"]=(new Date()).getTime()+data.expires_in*1000;
						$window.localStorage["locrefresh_portal"]=data.refresh_token;
					},
					error:function(data,header,config,status){
						console.log("获取token错误");
					}
				});
			}
		},
		/**用户登录**/
		loginService:function(){
			return "/portal/api/users/login?access_token="+$window.localStorage["loctoken_portal"];
		},
		/**获取新闻数据库Api**/
		dbNewsAll:function(){
			return "/crawler/api/news/getNewsDataForPage?ptimestamp=0&ptype=loadmore&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		dbNewsLoadMore:function(lastime){
			return "/crawler/api/news/getNewsDataForPage?ptimestamp="+lastime+"&ptype=loadmore&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		dbNewsDetail:function(nid){
			return "/crawler/api/news/getNewsById?pid="+nid+"&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		/**获取新闻wilddogApi**/
		wilddogNewsAll:function(){
			return "/news.json?orderBy=\"timestamp\"&limitToLast=10&print=pretty&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		wilddogNewsLoadMore:function(lastime,pindex){
			return "/news.json?orderBy=\"timestamp\"&startAt="+lastime+"&limitToLast="+(pindex+1)*10+"&print=pretty&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		wilddogNewsDetail:function(nid){
			return "/news/"+nid+".json?callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		}
	}
})