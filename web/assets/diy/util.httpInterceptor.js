/**
 * Created by uv2sun on 15/7/16.
 * angular $http拦截处理器
 */
angular.module('util.httpInterceptor', [])
    .factory('myHttpInterceptor', ['$q', '$window', 'uvLoading', function ($q, $window, uvLoading) {
        return {
            // optional method
            'request': function (config) {
                uvLoading.loading();
                return config;
            },

            'response': function (response) {
                uvLoading.unloading();
                return response;
            },
            'responseError': function (response) {
                if (response.status === 401) {
                    //TODO 转到登录页面
                } else if (response.status == 403) {
                    console.log(response.data);
                }
                uvLoading.unloading();
                return $q.reject(response);
            }
        };
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('myHttpInterceptor');
    }]);