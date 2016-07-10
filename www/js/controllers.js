angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,News,webapi,$ionicLoading,$ionicModal) {
    $scope.data = {};
    $("#maintabs").removeClass("tabs-item-hide");
    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    $scope.$on('modal.hidden', function() {
       $(".ion-android-radio-button-off span").each(function(i,item){
          $scope.CateLabels.removeByName($(item).text());
       });
       $scope.data={};
    });
    $scope.$on('modal.removed', function() {
      // Execute action
    });
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
    $scope.timeformat=function(t){
        if(t.length>0){
          return t.substr(5);
        }else
          return t;
    };
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
    };
    $scope.$on('stateChangeSuccess', function() {
       $scope.loadMoreData();
    });
    $scope.CateLabels = [{"id":1,"category":"热门"},{"id":2,"category":"会计"},{"id":3,"category":"计算机"},{"id":4,"category":"娱乐"},{"id":5,"category":"育儿"}];
    $scope.changeCate=function(t){
        if(t==100){
            $scope.modal.show();
        }else{
          $("a.itemcate").removeClass("active");
          $("#cate"+t).addClass("active");
        }
    };
    $scope.setCate=function(t){
      if($("#setcate"+t).hasClass("ion-android-checkmark-circle")){
        $("#setcate"+t).removeClass("ion-android-checkmark-circle");
        $("#setcate"+t).addClass("ion-android-radio-button-off");
      }else{
        $("#setcate"+t).removeClass("ion-android-radio-button-off");
        $("#setcate"+t).addClass("ion-android-checkmark-circle");
      }
    };
    $scope.addCate=function(){
       var sear_txt=$scope.data.searchCate;
       $scope.CateLabels.push({"id":(new Date).getTime(),"category":sear_txt});
    }
})

.controller('ArticleDetailCtrl', function($scope,$stateParams,News,$ionicLoading) {
  $("#maintabs").addClass("tabs-item-hide");
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

.controller('ChatsCtrl', function($scope,$state) {
  var islogin=localStorage.haslogin;
  if(islogin!=1){//已登录
    $state.go("tab.account");
  }
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

.controller('AccountCtrl', function($scope,$state,LoginService) {
    var islogin=localStorage.haslogin;
    if(islogin!=1){
       $state.go("tab.login");
    }
    $scope.data=JSON.parse(localStorage.userinfo);
})

.controller('LoginCtrl', function($scope,LoginService,$state,$ionicLoading) {
    $scope.data = {};
    $scope.login = function() {
        $ionicLoading.show();
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            //登录成功
            localStorage.haslogin = 1;
            $ionicLoading.hide();
            $state.go("tab.account");

        }).error(function(data) {
            localStorage.haslogin = 0
            var alertPopup = $ionicPopup.alert({
                title: '登录失败',
                template: '请检查您填写的登陆信息！'
            });
        });
      }

      $scope.forget = function() {
          //进行API提交后，发送邮件，发送成功后，进行alert提醒
          $state.go('resetpassword');
      }

      $scope.goregister = function() {
          $state.go('register');
      }
});
