angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,News,$ionicLoading) {
    $ionicLoading.show({
      template: '数据加载中...'
    });
    News.all($scope).success(function(data) {
      $ionicLoading.hide();
    }).error(function(data) {
      console.log("失败:"+data);
      $ionicLoading.hide();
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
