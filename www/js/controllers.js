angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,News,$ionicLoading) {
    $scope.run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
    $ionicLoading.show({
      template: '数据加载中...'
    });
    News.all($scope).success(function(data) {
      $ionicLoading.hide();
    }).error(function(data) {
      console.log("失败:"+data);
      $ionicLoading.hide();
    });
    $scope.doRefresh = function() {
      News.all($scope);
      $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.loadMoreData = function() {
        News.getmore($scope).success(function(data) {
           $scope.$broadcast('scroll.infiniteScrollComplete');
          }).error(function(data) {
          console.log("失败:"+data);
          }
        );
       
    };
    $scope.moreDataCanBeLoaded = function(){
        return $scope.hasMore;
    }
    $scope.$on('stateChangeSuccess', function() {
       $scope.loadMoreData();
    });
})

.controller('ArticleDetailCtrl', function($scope,$stateParams,News,$ionicLoading) {
  $ionicLoading.show({
      template: '数据加载中...'
  });
  $scope.newsid = $stateParams.newsid;
  News.get($scope,$scope.newsid).success(function(data){
    $ionicLoading.hide();
  }).error(function(data){
      console.log("失败:"+data);
      $ionicLoading.hide();
  });
})

.controller('ChatsCtrl', function($scope) {
  $scope.ChartLabels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.ChartData = [
     [65, 59, 80, 81, 56, 55, 40],
     [28, 48, 40, 19, 86, 27, 90]
  ];

  $scope.doughnutdata=[300, 500, 100];
  $scope.doughnutlabels=["Download Sales", "In-Store Sales", "Mail-Order Sales"];

  $scope.radardata=[
    [65, 59, 90, 81, 56, 55, 40],
    [28, 48, 40, 19, 96, 27, 100]
  ];
  $scope.radarlabels=["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

  $scope.piedata=[300, 500, 100];
  $scope.pielabels=["Download Sales", "In-Store Sales", "Mail-Order Sales"];

  $scope.polarareadata=[300, 500, 100, 40, 120];
  $scope.polararealabels=["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];

  $scope.basedata=[300, 500, 100, 40, 120];
  $scope.baselabels=["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
  $scope.basetype = 'PolarArea';
  $scope.toggle = function () {
    $scope.basetype = $scope.basetype === 'PolarArea' ? 'Pie' : 'PolarArea';
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
