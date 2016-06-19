angular.module('starter.services', [])

.factory('News', function($q,$http,$sce) {
  return {
    all: function($scope) {
      var d = $q.defer();
      var promise = d.promise;
      if(!$scope.run){
        $scope.run=true;
        $http.jsonp("http://lvyafei.jsp.jspee.com.cn/FSComponentCrawler/news/getNewsDataForPage?ptimestamp=0&ptype=loadmore&callback=JSON_CALLBACK")
        .success(function(data) {
            $scope.pageData=data;
            $scope.firsttimestamp=$scope.pageData[0].timestamp;
            $scope.lasttimestamp=$scope.pageData[$scope.pageData.length-1].timestamp;
            $scope.hasMore=data.length==10?true:false;
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
        $http.jsonp("http://lvyafei.jsp.jspee.com.cn/FSComponentCrawler/news/getNewsDataForPage?ptimestamp="+$scope.lasttimestamp+"&ptype=loadmore&callback=JSON_CALLBACK")
        .success(function(data) {
              $scope.pageData=data;
              $scope.hasMore=data.length==10?true:false;
              $scope.lasttimestamp=data[data.length-1].timestamp;
              Array.prototype.push.apply($scope.items, $scope.pageData);
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
      $http.jsonp("http://lvyafei.jsp.jspee.com.cn/FSComponentCrawler/news/getNewsById?pid="+newsId+"&callback=JSON_CALLBACK")
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
    }
  };
});
