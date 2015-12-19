/**
 * Created by uv2sun on 15/12/15.
 * 基于ngDialog简化版本
 */
angular.module('uv.service.dialog', ['ngDialog'])
    .service('uvDialog', ['ngDialog', function (ngDialog) {
        this.show = function (msg) {
            return showDialog(msg);
        };
        this.confirm = function (msg) {
            return confirm(msg);
        };

        /**
         * 提示信息确认框
         * @param msg
         * @returns {*} promise
         */
        function showDialog(msg) {
            return ngDialog.open({
                template: '<div class="panel panel-primary" style="border:none;margin:-20px;">' +
                '<div class="panel-body" style="font-size: 13px;">' + msg + '</div>' +
                '<div class="panel-footer" style="overflow: auto;">' +
                '   <button class="btn btn-sm btn-primary pull-right" ng-click="closeThisDialog(1)">确定</button>' +
                '</div>' +
                '</div>',
                plain: true, showClose: false
            }).closePromise.then(function (data) {
                return data.value;
            });
        }

        /**
         * 确认信息提示框 promise dialog
         * @returns {*} promise 1:确定,其他取消
         */
        function confirm(msg) {
            return ngDialog.open({
                template: '<div class="panel panel-primary" style="border:none;margin:-20px;">' +
                '<div class="panel-body" style="font-size: 13px;">' + msg + '</div>' +
                '<div class="panel-footer" style="overflow: auto;">' +
                '   <button class="btn btn-sm btn-default pull-right" style="margin-left: 10px;" ng-click="closeThisDialog()">取消</button>' +
                '   <button class="btn btn-sm btn-primary pull-right" ng-click="closeThisDialog(1)">确定</button>' +
                '</div>' +
                '</div>',
                plain: true, showClose: false
            }).closePromise.then(function (data) {
                return data.value;
            });
        }
    }]);