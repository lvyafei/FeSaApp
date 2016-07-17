angular.module('starter.services', [])

.factory('News', function($q,$http,$sce,webapi) {
  return {
    all: function($scope) {
      var d = $q.defer();
      var promise = d.promise;
      if(!$scope.run){
        $scope.run=true;
        webapi.getAccessTokenCrawler();
        $http.jsonp(webapi.dbNewsAll())
        .success(function(data,status,headers,config) {
            $scope.pageData=data.datas;
            $scope.firsttimestamp=$scope.pageData[0].timestamp;
            $scope.lasttimestamp=$scope.pageData[$scope.pageData.length-1].timestamp;
            $scope.hasMore=data.length==10?true:false;
            $scope.items = $scope.pageData;
            d.resolve(data);
        })
        .error(function(data,status,headers,config) {
            if(status!=200){
                webapi.getAccessToken();
            }
            d.reject(status);
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
        webapi.getAccessTokenCrawler();
        $http.jsonp(webapi.dbNewsLoadMore($scope.lasttimestamp))
        .success(function(data) {
              $scope.pageData=data.datas;
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
      webapi.getAccessTokenCrawler();
      $http.jsonp(webapi.dbNewsDetail(newsId))
        .success(function(data) {
            $scope.news=data.datas;
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
    updateRead:function(nid,uid,tid){
         $.ajax({
            type:'post',
            url:webapi.updateRead(),
            data:{
                "newsid":nid,
                "userid":uid,
                "typeid":tid
            },
            dataType:'json',
            success:function(data){
                if(data.datas!=null){
                     alert("收藏成功");
                }else{
                    alert("收藏失败");
                }
            },
            error:function(data){
                alert('updateRead Error');
            }
        });
    },
    updateComment:function(nid,uid,comment){
        $.ajax({
            type:'post',
            url:webapi.updateComment(),
            data:{
                "newsid":nid,
                "userid":uid,
                "commentInfo":comment
            },
            dataType:'json',
            success:function(data){
                if(data.datas!=null){
                     alert("评论成功");
                }else{
                    alert("评论失败");
                }
            },
            error:function(data){
                alert('updateComment Error');
            }
        });
    }
  };
})

.service('LoginService', function($q, $http,webapi) {
    return {
        loginUser: function(name, pwd) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            var loginResult = new Object();
            webapi.getAccessTokenPortal();
            //ajax请求
            $.ajax({
                type:'post',
                url:webapi.loginService(),
                data:{
                    "username":name,
                    "password":pwd
                },
                dataType:'json',
                success:function(data){
                    if(data.datas!=null){
                         localStorage.userinfo = JSON.stringify(data.datas);
                         console.log("欢迎："+JSON.parse(localStorage.userinfo).userName);
                         deferred.resolve('Welcome ' + data.datas.userName + '!');
                    }else{
                        deferred.reject('Wrong credentials.');
                    }
                },
                error:function(data){
                    deferred.reject('Login Error');
                }
            });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        register: function(email, name, password) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp("http://api.gugujiankong.com/account/Register?email=" + email + "&username=" + name + "&password=" + password + "&callback=JSON_CALLBACK")
                .success(function(response) {
                    if (response == 1) {
                        deferred.resolve('register successfully');
                    } else {
                        deferred.reject('Wrong register info.');
                    }
                });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        resetpassword: function(email) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            //ajax请求
            $http.jsonp("http://api.gugujiankong.com/account/resetpassword?email=" + email + "&callback=JSON_CALLBACK")
                .success(function(response) {
                    if (response == 1) {
                        deferred.resolve('reset password successfully');
                    } else {
                        deferred.reject('Wrong request');
                    }
                });
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        },
        getsetting: function($scope) {
            var d = $q.defer();
            var promise = d.promise;
            //ajax请求
            $http.jsonp("http://api.gugujiankong.com/account/GetUserSetting?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    $scope.apppush.checked = data.AppPush;
                    $scope.smspush.checked = data.SmsPush;
                    $scope.phonepush.checked = data.PhonePush;
                    $scope.userphone = data.UserPhone;
                    $scope.data.userphone = data.UserPhone;
                    $scope.phonevalidated = data.PhoneValidated;
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

        sendcode: function($scope, $ionicPopup) {
            var d = $q.defer();
            var promise = d.promise;
            //ajax请求
            $http.jsonp("http://api.gugujiankong.com/account/SendPhoneValidateCode?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&phone=" + $scope.data.userphone + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    if (data.SetPushStatus != 1) {
                        var confirmPopup = $ionicPopup.alert({
                            title: '推送设置',
                            template: data.SetPushStatusComment
                        });
                    };
                    d.resolve(data);
                })
                .error(function(error) {
                    var confirmPopup = $ionicPopup.alert({
                        title: '推送设置',
                        template: '验证码发送失败，请重试！'
                    });
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

        finalbind: function($scope, $ionicPopup) {
            var d = $q.defer();
            var promise = d.promise;
            //ajax请求
            $http.jsonp("http://api.gugujiankong.com/account/FinalBind?userId=" + localStorage.userid + "&phone=" + $scope.data.userphone + "&code=" + $scope.data.code + "&signToken=" + localStorage.signtoken + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    if (data.SetPushStatus != 1) {
                        var confirmPopup = $ionicPopup.alert({
                            title: '推送设置',
                            template: data.SetPushStatusComment
                        });
                    };
                    d.resolve(data);
                })
                .error(function(error) {
                    var confirmPopup = $ionicPopup.alert({
                        title: '推送设置',
                        template: '手机号码绑定失败，请重试！'
                    });
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
        switchnotify: function($scope, $ionicPopup, type) {
            var d = $q.defer();
            var promise = d.promise;
            var value;
            if (type == 1) {
                value = $scope.apppush.checked;
            }
            if (type == 2) {
                value = $scope.smspush.checked;
            }
            if (type == 3) {
                value = $scope.phonepush.checked;
            }
            //ajax请求
            $http.jsonp("http://api.gugujiankong.com/account/SetPush?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&type=" + type + "&value=" + value + "&callback=JSON_CALLBACK")
                .success(function(data) {
                    if (data.SetPushStatus != 1) {
                        var confirmPopup = $ionicPopup.alert({
                            title: '推送设置',
                            template: data.SetPushStatusComment
                        });
                    };
                    d.resolve(data);
                })
                .error(function(error) {
                    var confirmPopup = $ionicPopup.alert({
                        title: '推送设置',
                        template: '手机号码绑定失败，请重试！'
                    });
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
    }
});

