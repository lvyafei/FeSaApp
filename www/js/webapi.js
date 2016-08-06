angular.module('starter.webapi', [])
.factory('webapi',function($http,$window) {
	var _hosts_portal="http://lvyafei-fesa.daoapp.io";//"http://localhost:9090";
	var _hosts_crawler="http://lvyafei-fesa.daoapp.io";//"http://localhost:9091";

	var _crawler_gettoken="/crawler/oauth/token?grant_type=password&client_id=restapp&client_secret=restapp&username=fsmobile&password=fsmobile@20160704";
	var _crawler_refreshToken="/crawler/oauth/token?grant_type=refresh_token&client_id=restapp&client_secret=restapp&refresh_token=";
	
	var _portal_gettoken="/portal/oauth/token?grant_type=password&client_id=restapp&client_secret=restapp&username=fsmobile&password=fsmobile@20160704";
	var _portal_refreshtoken="/portal/oauth/token?grant_type=refresh_token&client_id=restapp&client_secret=restapp&refresh_token=";
	
	var _wilddog="https://201605111151fei.wilddogio.com";
	return {
		getAccessTokenCrawler:function(){
			var loctoken=$window.localStorage["loctoken_crawler"];
			var locexpires=$window.localStorage["locexpiration_crawler"];
			var curtime=(new Date()).getTime();
			if((loctoken==null||loctoken=="")||parseInt(locexpires)<curtime){//获取token
				$.ajax({
					type:'GET',
					url:_hosts_crawler+_crawler_gettoken,
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
					url:_hosts_portal+_portal_gettoken,
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
			return _hosts_portal+"/portal/api/users/login?access_token="+$window.localStorage["loctoken_portal"];
		},
		/**获取新闻数据库Api**/
		dbNewsAll:function(){
			return  _hosts_crawler+"/crawler/api/news/getNewsDataForPage?ptimestamp=0&ptype=loadmore&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		dbNewsLoadMore:function(lastime){
			return  _hosts_crawler+"/crawler/api/news/getNewsDataForPage?ptimestamp="+lastime+"&ptype=loadmore&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		dbNewsDetail:function(nid){
			return _hosts_crawler+"/crawler/api/news/getNewsById?pid="+nid+"&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},

		/**获取新闻wilddogApi**/
		wilddogNewsAll:function(){
			return _wilddog+"/news.json?orderBy=\"timestamp\"&limitToLast=10&print=pretty&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		wilddogNewsLoadMore:function(lastime,pindex){
			return _wilddog+"/news.json?orderBy=\"timestamp\"&startAt="+lastime+"&limitToLast="+(pindex+1)*10+"&print=pretty&callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},
		wilddogNewsDetail:function(nid){
			return _wilddog+"/news/"+nid+".json?callback=JSON_CALLBACK&access_token="+$window.localStorage["loctoken_crawler"];
		},

		/**用户评论**/
		updateRead:function(){
			return _hosts_portal+"/portal/api/news/updateNewsRead?access_token="+$window.localStorage["loctoken_portal"];
		},
		getNewsRead:function(nid,tid){
			return _hosts_portal+"/portal/api/news/getNewsRead?access_token="+$window.localStorage["loctoken_portal"]+"&newsid="+nid+"&typeid="+tid;
		},
		updateComment:function(){
			return _hosts_portal+"/portal/api/news/updateNewsComment?access_token="+$window.localStorage["loctoken_portal"];
		},
		getNewsComment:function(nid){
			return _hosts_portal+"/portal/api/news/getNewsComment?access_token="+$window.localStorage["loctoken_portal"]+"&newsid="+nid;
		}
	}
})