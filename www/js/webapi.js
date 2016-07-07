angular.module('starter.webapi', [])
.factory('webapi', function($http) {
	var _hosts="http://lvyafei1.jsp.jspee.com.cn";
	var _gettoken="/portal/oauth/token?grant_type=password&client_id=restapp&client_secret=restapp&username=fsmobile&password=fsmobile@20160704";
	var _refreshToken="/portal/oauth/token?grant_type=refresh_token&client_id=restapp&client_secret=restapp&refresh_token=7ac7940a-d29d-4a4c-9a47-25a2167c8c49";
	var _accessToken="";
	return {
		/**全局变量**/
		hosts:"http://lvyafei1.jsp.jspee.com.cn",
		wilddog:"https://201605111151fei.wilddogio.com",
		getAccessToken:function(){
			if(_accessToken==""){
				$http({
					url:_hosts+_gettoken,
					method:'GET'
				}).success(function(data,header,config,status){
					_accessToken=data.access_token;
					console.log(_accessToken);
					return _accessToken;
				}).error(function(data,header,config,status){
					console.log("获取token错误");
					return "";
				});
			}else{
				return _accessToken;
			}
		},
		/**用户登录**/
		loginService:"/portal/api/users/login?access_token=fe11c4e9-f57c-4d61-a4cd-ec4f5763acfc",

		/**获取新闻数据库Api**/
		dbNewsAll:"/crawler/api/news/getNewsDataForPage?ptimestamp=0&ptype=loadmore&callback=JSON_CALLBACK&access_token=",
		dbNewsLoadMore:function(lastime){
			return "/crawler/api/news/getNewsDataForPage?ptimestamp="+lastime+"&ptype=loadmore&callback=JSON_CALLBACK";
		},
		dbNewsDetail:function(nid){
			return "/crawler/api/news/getNewsById?pid="+nid+"&callback=JSON_CALLBACK";
		},

		/**获取新闻wilddogApi**/
		wilddogNewsAll:"/news.json?orderBy=\"timestamp\"&limitToLast=10&print=pretty&callback=JSON_CALLBACK",
		wilddogNewsLoadMore:function(lastime,pindex){
			return "/news.json?orderBy=\"timestamp\"&startAt="+lastime+"&limitToLast="+(pindex+1)*10+"&print=pretty&callback=JSON_CALLBACK";
		},
		wilddogNewsDetail:function(nid){
			return "/news/"+nid+".json?callback=JSON_CALLBACK";
		}
	}
})