/**
 * Created by uv2sun on 15/12/15.
 * 主APP
 */

angular.module('index-app', ['ui.router', 'uv.service.loading', 'uv.service.dialog'])
    .config(['$urlRouterProvider', '$stateProvider', 'uvLoadingProvider', '$locationProvider',
        function ($urlRouterProvider, $stateProvider, uvLoadingProvider, $locationProvider) {
            uvLoadingProvider.setLoadingGif('assets/diy/uv-loading/loading.gif');
            $urlRouterProvider.otherwise("/app");
            $stateProvider
                .state('root', {
                    url: '/root'
                })
                .state('app', {
                    parent: 'root',
                    url: '^/app',
                    views: {
                        'navbar@': {
                            templateUrl: 'app/index/template/navbar.html',
                            controller: ['$rootScope', '$scope', '$state', 'ngDialog', 'uvDialog',
                                function ($rootScope, $scope, $state, ngDialog, uvDialog) {
                                    //退出
                                    $scope.logout = function () {
                                        window.location = "/logout";
                                    };
                                    //修改个人信息
                                    $scope.modify_self = function () {
                                        $state.go('user.update', {
                                            login_id: $scope.login_user_id,
                                            next_state: 'index'
                                        })
                                    };

                                    $scope.modify_password = function () {
                                        $scope.login_id = $scope.login_user_id;
                                        $scope.user = $scope.login_user;
                                        return ngDialog.open({
                                            scope: $scope, closeByDocument: false, showClose: false,
                                            template: 'change_password_dialog',
                                            overlay: true,
                                            controller: function ($scope, $q, userService) {
                                                $scope.valid = {};
                                                $scope.change_password = function () {
                                                    var user = {
                                                        login_id: $scope.login_id,
                                                        old_password: $scope.old_password,
                                                        new_password: $scope.new_password,
                                                        new_password_repeat: $scope.new_password_repeat
                                                    };
                                                    console.log(user);
                                                    $scope.valid_old().then(function (res) {
                                                        if (res) {
                                                            $scope.valid = {};
                                                            if (!user.new_password) {
                                                                $scope.valid.new_password = '请输入新密码';
                                                                return false;
                                                            } else if (user.new_password != user.new_password_repeat) {
                                                                $scope.valid.new_password_repeat = '两次输入的新密码不一致';
                                                                return false;
                                                            }
                                                        } else {
                                                            return false;
                                                        }
                                                        return true;
                                                    }).then(function (res) {
                                                        if (res) {
                                                            user.login_password = md5(user.new_password);
                                                            userService.changePassword(user).then(function (res) {
                                                                if (res && res.ret_code == '0') {
                                                                    uvdialog.show('修改成功,请重新登录');
                                                                    window.location = "/logout";
                                                                }
                                                                else {
                                                                    uvDialog.show('[' + res.ret_code + '],' + res.ret_msg);
                                                                }
                                                            })
                                                        }
                                                    })
                                                };
                                                $scope.valid_old = function () {
                                                    delete $scope.valid.old_password;
                                                    if (!$scope.old_password) {
                                                        $scope.valid.old_password = '请输入当前密码';
                                                        return false;
                                                    } else {
                                                        return userService.select({login_id: $scope.login_id}).then(function (res) {
                                                            var passwd = res.data.login_password;
                                                            console.log('real passwd:%s', passwd);
                                                            var old_passwd = md5(md5($scope.old_password));
                                                            console.log('old passwd:%s', old_passwd);
                                                            if (old_passwd != passwd) {
                                                                $scope.valid.old_password = '当前密码错误';
                                                                return false;
                                                            } else {
                                                                return true;
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }).closePromise
                                            .then(function (data) {

                                            });
                                    };
                                }
                            ]
                        }
                        , 'left@': {
                            templateUrl: 'app/index/template/left.html',
                            controller: ['$scope', function ($scope) {
                            }]
                        }
                        , 'content@': {templateUrl: 'app/index/template/content.html'}
                    }
                });

            //  去掉URL的"#"
            //$locationProvider.html5Mode(true);

        }]);
