angular.module('starter.services', [])

.factory('News', function($q,$http,$sce) {

  return {
    all: function($scope) {
      var d = $q.defer();
      var promise = d.promise;
      $http.jsonp("https://201605111151fei.wilddogio.com/news.json?callback=JSON_CALLBACK")
        .success(function(data) {
            $scope.items = data;
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
    remove: function(news) {
      //newsdatas.splice(newsdatas.indexOf(news), 1);
    },
    get: function($scope,newsId) {
      var d = $q.defer();
      var promise = d.promise;
      $http.jsonp("https://201605111151fei.wilddogio.com/news/"+newsId+".json?callback=JSON_CALLBACK")
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
