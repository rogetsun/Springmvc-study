/**
 * Created by uv2sun on 15/7/13.
 */

angular.module('uv.fixed', [])
    /**
     * 需要滚动粘帖顶部的元素添加uv-sticky
     * 需要指定粘帖时距离顶部距离的给uv-sticky赋值，默认10个像素。注意赋值时不带单位px
     *
     * 注意：依赖jQuery
     *
     * 实现逻辑：
     *      1、将需要滚动时，粘帖顶部的元素前面插入一个占位元素，并设置样式。
     *      2、将粘帖元素加在body上，并设置为绝对定位
     *      3、给粘帖元素按占位元素的offset设置，并设置其max-height不可超出网页可是范围。
     *      4、重新粘帖元素的高度设置占位元素的高度
     *      5、增加滚动监听，当滚动高度大于粘帖元素在非fixed时可滚动的高度，改为fixed定位；否则absolute到body
     * */
    .directive('uvSticky', ['$document', '$timeout', function ($document, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: "<div ng-transclude></div>",
            scope: {},
            link: function (scope, elem, attr) {
                /***
                 * document.onready时，获取元素offset定位时，网页css渲染未必完成，所以获取的offset可能是错误的。
                 * window.load或者放在$timeout可解决。
                 */
                $timeout(function () {


                    /** 临时占位元素 */
                    var tElem = angular.element("<div></div>")
                        .attr('style', elem.attr('style'))
                        .attr('class', elem.attr('class'))
                        .css('width', elem.css('width'))
                        //                                    .css('height', elem.css('auto'))
                        .css('display', elem.css('display') || 'block')
                        .css('position', elem.css('position'))
                        .css('opacity', '0')
                        .insertBefore(elem);
                    var background = elem.css('background');
                    /** 粘帖顶部后，距离顶部高度位置 */
                    scope.uvStickyTop = parseInt(attr.uvSticky || 10);
                    //粘帖元素本身初始状态应该的高度，和替换它的占位元素一致。
                    var initTop = tElem.offset().top,
                    //左边距离
                        initLeft = tElem.offset().left,
                    //粘帖元素滚动时，不做fixed定位可滚动高度 ＝ 粘帖元素初始高度 - 元素本身margin-top - 粘帖时顶部高度
                        canScrollTop = initTop - parseInt(elem.css('margin-top')) - scope.uvStickyTop;

                    /** 粘帖顶部元素 */
                    elem.css('position', 'absolute')
                        .css('overflow', 'auto')
                        .css('max-height', angular.element(window).height() - initTop)
                        .css('width', tElem.css('width'))
                        .attr('class', tElem.attr('class'))
                        .css('background', tElem.css('background'))
                        .css('border', tElem.css('border'))
                        //.appendTo('body')
                        .offset(tElem.offset());

                    tElem.css('height', elem.css('height'))
                        .css('border', 'none')
                        .css('background', 'rgba(0,0,0,0)');

                    $document.scroll(function () {
                        /***
                         * 如果滚动高度大于可滚动高度，做fixed定位；否则按占位元素的offset绝对定位到body
                         */
                        if ($document.scrollTop() > canScrollTop) {
                            elem.css('position') != 'fixed' &&
                            elem.css('position', 'fixed')
                                .css({top: scope.uvStickyTop, left: initLeft})
                                .css('z-index', '9999');
                        } else {
                            elem.css('position') == 'fixed' && elem.css('position', 'absolute');
                            elem.offset().top != initTop && elem.offset(tElem.offset()).css('z-index', 1);
                        }
                    });

                });

            }

        }
    }])
    /***
     * 获取各种高、度宽度
     */
    .service('WHService', ['$window', '$document', function ($window, $document) {
        function GetInfo() {
            var s = "";
            s += "\r\ndocument.body.clientWidth :网页可见区域宽：" + document.body.clientWidth;
            s += "\r\ndocument.body.clientHeight:网页可见区域高：" + document.body.clientHeight;
            s += "\r\ndocument.body.offsetWidth :网页可见区域宽：" + document.body.offsetWidth + " (包括边线和滚动条的宽)";
            s += "\r\ndocument.body.offsetHeight:网页可见区域高：" + document.body.offsetHeight + " (包括边线的宽)";
            s += "\r\ndocument.body.scrollWidth :网页正文全文宽：" + document.body.scrollWidth;
            s += "\r\ndocument.body.scrollHeight:网页正文全文高：" + document.body.scrollHeight;
            s += "\r\ndocument.body.scrollTop   :网页被卷去的高(ff)：" + document.body.scrollTop;
            s += "\r\ndocument.documentElement.scrollTop:网页被卷去的高(ie)：" + document.documentElement.scrollTop;
            s += "\r\ndocument.body.scrollLeft  :网页被卷去的左：" + document.body.scrollLeft;
            s += "\r\nwindow.screenTop          :网页正文部分上：" + window.screenTop;
            s += "\r\nwindow.screenLeft         :网页正文部分左：" + window.screenLeft;
            s += "\r\nwindow.screen.height      :屏幕分辨率的高：" + window.screen.height;
            s += "\r\nwindow.screen.width       :屏幕分辨率的宽：" + window.screen.width;
            s += "\r\nwindow.screen.availHeight :屏幕可用工作区高度:" + window.screen.availHeight;
            s += "\r\nwindow.screen.availWidth  :屏幕可用工作区宽度：" + window.screen.availWidth;
            s += "\r\nwindow.screen.colorDepth  :你的屏幕设置是 " + window.screen.colorDepth + " 位彩色";
            s += "\r\nwindow.screen.colorDepth  :你的屏幕设置 " + window.screen.deviceXDPI + " 像素/英寸";
            console.log(s)
        }

        return {getWH: GetInfo}
    }]);
