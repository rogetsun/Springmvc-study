/**
 * Created by uv2sun on 15/6/4.
 */
angular.module('fullcalendar.router', ['ui.router','ngDialog','Resource'])
    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('fullcalendar', {
                parent:'index',
                url:'/fullcalendar',

                templateUrl:'app/fullcalendar/tpls/fullcalendar.html',
                controller:['$scope','$state','$filter','ngDialog','resource',function ($scope,$state,$filter,ngDialog,resource) {
                    $scope.title = {
                        title: '日程安排'
                    };
                    $scope.$emit('to-parent', $scope.title);
                    $(document).ready(function() {

                        //只取代办事件，还未设定时间等
                        resource.list('/mession').then(function(data) {
                            $scope.readymess = data;
                        });

                        $('#calendar').fullCalendar({

                            header: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay'
                            },
                            eventLimit: true, // allow "more" link when too many events
                            //theme: true,//是否使用jquery ui
                            //allDaySlot : true,不知道干嘛的
                            //defaultDate: '2015-02-12',
                            weekNumbers:true,//显示周数
                            editable: true,//日程是否可以拖拽

                            dragOpacity: {//设置拖动时事件的透明度
                                agenda: .1,
                                '':.1
                            },
                            businessHours: true,//节假日
                            droppable: true, // this allows things to be dropped onto the calendar重外向内拖

                            /* // 当前div有事件不能对其操作
                             selectOverlap:true,
                             selectOverlap: function(event) {},
                             // 事件重叠
                             eventOverlap:false,
                             eventOverlap: function(stillEvent, movingEvent) {},
                             */

                            drop: function( date, jsEvent, ui ) {
                                $(this).remove();
                                /*  // 小div选择后 拖一个消失一个
                                 if ($('#drop-remove').is(':checked')) {
                                 $(this).remove();
                                 }*/
                                if (confirm("是否对其更改?'确认'将不可更改！")) {

                                }else{
                                    //进表
                                }
                                //var div =  $(".fc-event-container:contains("+jsEvent.target.innerHTML+")");
                                var div =  $("span:contains("+jsEvent.target.innerHTML+")");
                                div.after("<span style='float:right;margin-right:5px;'><i class='glyphicon glyphicon-ok'></i></span>");

                                /*var originalEventObject = $(this).data('eventObject');
                                 var copiedEventObject = $.extend({}, originalEventObject);
                                 copiedEventObject.start = date;
                                 copiedEventObject.allDay = allDay;
                                 $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
                                 if ($('#drop-remove').is(':checked')) {
                                 $(this).remove();
                                 }*/
                            },
                            //缩放日程 拉升
                            eventResize: function(event, delta, revertFunc, jsEvent, ui, view ) {
                                if (confirm("是否对其更改?'确认'将不可更改！")) {
                                    console.log('aa');
                                }else{
                                    revertFunc();
                                }

                            },

                            selectable: true, //允许用户拖动日期 进行权限判断
                            select: function( startDate, endDate, allDay, jsEvent, view ){
                                /*权限判断是否可以选择时间
                                 if(){
                                 $('#calendar').fullCalendar('unselect');
                                 return;
                                 }*/
                                var startdate = $filter('date')(startDate._d, "yyyy-MM-dd");
                                var enddate = $filter('date')(endDate._d, "yyyy-MM-dd");
                                var starttime = (new Date(startdate)).getTime();
                                var endtime = (new Date(enddate)).getTime();
                                var days = (endtime-starttime)/3600000/24;
                                for(var i = 0;i<days;i++){
                                    var d = $filter('date')(starttime+(i*24*60*60*1000), "yyyy-MM-dd");
                                    //存表
                                    $("td[data-date="+d+"]").eq(0).css("background-image","url(assets/images/fangjia.jpg)");
                                }
                            },
                            //移动日程，可以跨天 跨小时，用jsEvent的时间戳
                            eventDrop: function(event, delta, revertFunc, jsEvent, ui, view ) {
                                if (confirm("是否对其更改?'确认'将不可更改！")) {
                                    //截取时间，进行存表，
                                }else{
                                    revertFunc();
                                }
                            },

                            eventClick: function(event) {  // 日历项，调用jQueryUi的dialog显示日历项的内容
                                $scope.formData={};
                                $scope.formData._id = event._id;
                                $scope.formData.start = event.start._d;
                                //$scope.formData.end = event.end._d;加个if 判断
                                $scope.formData.title = event.title;
                                $scope.formData.allDay = event.allDay;
                                $scope.formData.color = event.color;
                                ngDialog.open({ template: 'app/fullcalendar/tpls/add.html',//模式对话框内容为test.html
                                    className: 'ngdialog-theme-plain',
                                    scope:$scope //将scope传给test.html,以便显示地址详细信息
                                });
                                /*$scope.modify = function () {
                                 var start = $filter('date')($scope.formData.start, "yyyy-MM-ddTHH:mm:ss");
                                 var end = $filter('date')($scope.formData.end, "yyyy-MM-ddTHH:mm:ss");
                                 $scope.formData.start = start;
                                 $scope.formData.end = end;
                                 $scope.formData.allDay = true;
                                 resource.modify('/mession',$scope.formData).then(function (data) {});
                                 $('#calendar').fullCalendar('renderEvent', $scope.formData, true);
                                 ngDialog.closeAll();
                                 };*/

                            },
                            dayClick: function(date, allDay, jsEvent, view) { // 日期格子，调用dialog生成创建新日历项的对话框
                                /*
                                 $('#calendar').fullCalendar('unselect');
                                 return;*/

                                //添加事件
                                ngDialog.open({ template: 'app/fullcalendar/tpls/add.html',//模式对话框内容为test.html
                                    className: 'ngdialog-theme-plain',
                                    scope:$scope //将scope传给test.html,以便显示地址详细信息
                                });
                                $scope.formData={};
                                $scope.formData.start = $scope.formData.end= date._d;
                                //$scope.formData.end = null;
                                $scope.formData.color="#3a87ad";
                                $scope.add = function () {
                                    var start = $filter('date')($scope.formData.start, "yyyy-MM-ddTHH:mm:ss");
                                    var end = $filter('date')($scope.formData.end, "yyyy-MM-ddTHH:mm:ss");
                                    //  console.log( $scope.formData.start.getTime());时间比较
                                    //存入库中
                                    $scope.formData.start = start;
                                    $scope.formData.end = end;
                                    $scope.formData.allDay = true;
                                    //console.log(allDay);
                                    resource.save('/mession',$scope.formData).then(function (data) {});
                                    $('#calendar').fullCalendar('renderEvent', $scope.formData, true);
                                    ngDialog.closeAll();
                                };
                            },
                            //事件源
                            events: function(start, end, callback) {
                                $("td[data-date='2015-07-11']").eq(0).css("background-image","url(assets/images/fangjia.jpg)");
                                /*  resource.list('/mession').then(function(data){
                                 //取到的是已经设定时间计划好的，且不可更改的
                                 $scope.messions = data;
                                 $.each($scope.messions, function (index, term) {
                                 // $("#calendar").fullCalendar('renderEvent', term, true);
                                 $("#calendar").fullCalendar('renderEvent', term);
                                 });
                                 });*/
                            },
                            eventMouseout:function( event, jsEvent, view ) {
                                //alert('确定？');
                            }

                        });
                    });
                }]
            })


    }])
    .directive('draggable', function() {
        return function(scope,element) {
            element.draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  // 拖拽显示的位置在哪个后面
            });
            element.data('event', {
                title:scope.read_mess.title,
                stick: true // maintain when user navigates (see docs on the renderEvent method)
            });
        }


    });
/**
 * Created by Administrator on 2015/7/16.
 */
