angular.module('starter.wilddogservices', [])

.factory('widdogNews', function($q,$http,$sce,webapi) {
  return {
    all: function($scope) {
      var d = $q.defer();
      var promise = d.promise;
      if(!$scope.run){
        $scope.run=true;
        $http.jsonp(webapi.wilddog+webapi.wilddogNewsAll)
        .success(function(data) {
            $scope.pageData=new Array();
            for(obj in data){
              var itm=new Object();
              itm.id=obj;
              itm.time=data[obj].time;
              itm.timestamp=data[obj].timestamp;
              itm.url=data[obj].url;
              itm.image=data[obj].image;
              itm.title=data[obj].title;
              itm.source=data[obj].source;
              $scope.pageData.push(itm);
            }
            $scope.pageData.sort(function(a,b){
              return b.timestamp-a.timestamp;
            });
            $scope.firsttimestamp=$scope.pageData[0].timestamp;
            $scope.lasttimestamp=$scope.pageData[$scope.pageData.length-1].timestamp;
            $scope.pageindex=0;
            if($scope.pageData.length==10)
              $scope.hasMore=true;
            else
              $scope.hasMore=false;
            $scope.items = $scope.pageData;
            d.resolve(data);
        })
        .error(function(error) {
            d.reject(error);
        });
      }
      promise.success = function(fn) {
          promise.then(fn);
          $scope.run=false;
          return promise;
      }
      promise.error = function(fn) {
          promise.then(null, fn);
          $scope.run=false;
          return promise;
      }
      return d.promise;
    },
    getmore: function($scope){
      $scope.pageindex=$scope.pageindex+1;
      var d = $q.defer();
      var promise = d.promise;
      if(!$scope.run){
        $http.jsonp(webapi.wilddog+webapi.wilddogNewsLoadMore($scope.lasttimestamp,$scope.pageindex))
        .success(function(data) {
              var findex=0;
              for(obj in data){
                var itm=new Object();
                itm.id=obj;
                itm.time=data[obj].time;
                itm.timestamp=data[obj].timestamp;
                itm.url=data[obj].url;
                itm.image=data[obj].image;
                itm.title=data[obj].title;
                itm.source=data[obj].source;
                $scope.pageData.push(itm);
                findex=findex+1;
              }
              if(findex==10)
                $scope.hasMore=true;
              else
                $scope.hasMore=false;
              $scope.pageData.sort(function(a,b){
                return b.timestamp-a.timestamp;
              });
              $scope.items = $scope.pageData;
              d.resolve(data);
          })
        .error(function(error) {
              $scope.pageindex=$scope.pageindex-1;
              d.reject(error);
        });
      }
      promise.success = function(fn) {
          promise.then(fn);
          $scope.run=false;
          return promise;
      }
      promise.error = function(fn) {
          promise.then(null, fn);
          $scope.run=false;
          return promise;
      }
      return d.promise;
    },
    remove: function(news) {
      //newsdatas.splice(newsdatas.indexOf(news), 1);
    },
    get: function($scope,newsId) {
      var d = $q.defer();
      var promise = d.promise;
      $http.jsonp(webapi.wilddog+webapi.wilddogNewsDetail(newsId))
        .success(function(data) {
            $scope.news=data;
            $scope.newsurl=$sce.trustAsResourceUrl($scope.news.url);
            d.resolve(data);
        })
        .error(function(error) {
            d.reject(error);
      });
      promise.success = function(fn) {
          promise.then(fn);
          return promise;
      }
      promise.error = function(fn) {
          promise.then(null, fn);
          return promise;
      }
      return d.promise;
    },
    getHasMore:function(){
      return hasMore;
    }
  };
});
