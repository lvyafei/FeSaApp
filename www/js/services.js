angular.module('starter.services', [])

.factory('News', function($q,$http,$sce,webapi) {
  return {
    all: function($scope) {
      var d = $q.defer();
      var promise = d.promise;
      if(!$scope.run){
        $scope.run=true;
        $http.jsonp(webapi.hosts+webapi.dbNewsAll)
        .success(function(data,status,headers,config) {
            $scope.pageData=data;
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
        $http.jsonp(webapi.hosts+webapi.dbNewsLoadMore($scope.lasttimestamp))
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
      $http.jsonp(webapi.hosts+webapi.dbNewsDetail(newsId))
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
})

.service('LoginService', function($q, $http) {

    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var loginResult = new Object();
            //ajax请求
            $http.jsonp("http://api.gugujiankong.com/account/Login?email=" + name + "&password=" + pw + "&callback=JSON_CALLBACK")
                .success(function(response) {
                    loginResult = response;
                    if (loginResult.LoginStatus == 1) {
                        localStorage.signtoken = loginResult.SignToken;
                        localStorage.userid = loginResult.UserId;

                        //设置客户端的别名，用于定向接收消息的推送
                        //window.plugins.jPushPlugin.setAlias("Client" + loginResult.UserId);

                        var arrayObj = new Array("Tags" + loginResult.UserId);
                        window.plugins.jPushPlugin.setTags(arrayObj);

                        //上传设备ID
                        //console.log("Begin - JPushPlugin:registrationID is " + data);
                        //window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                        //var onGetRegistradionID = function (data) {
                        //    try {
                        //        console.log("JPushPlugin:registrationID is " + data);
                        //        //ajax上传
                        //        $http.jsonp("http://api.gugujiankong.com/account/Uploadregistrationid?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&registrationid=" + data + "&callback=JSON_CALLBACK")
                        //            .success(function (response) {
                        //            });
                        //    }
                        //    catch (exception) {
                        //        console.log(exception);
                        //    }
                        //};
                        //console.log("End - JPushPlugin:registrationID is " + data);

                        deferred.resolve('Welcome ' + name + '!');
                    } else {
                        deferred.reject('Wrong credentials.');
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

