/**
 * Created by weie on 2016/12/27.
 */
if (typeof jQuery === 'undefined') {
    throw new Error('TimeSchedule\'s JavaScript requires jQuery')
}
(function ($) {
/*  'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.');
    if ((version[0] < 2 && version[1] < 6) || (version[0] == 1 && version[1] == 6 && version[2] < 1)) {
        throw new Error('TimeSchedule\'s JavaScript requires jQuery version 1.6.1 or higher');
    }*/









}(jQuery));
(function($){
    var TimeSlider = function(element, options){
        this.start_times = null;//记录初始开始时间的毫秒数
        this.static_date = "2016-12-19";

        this.static_date_string = "2016-12-19 12:00:00";

        this.$element = null;
        this.$ruler = null;
        this.$prompts = null;
        this.options = null;
        this.init_timestamp = new Date(this.static_date_string);//初始化时间戳,获取当前时间点
        this.frozen_current_timestamp = 0;
        this.px_per_ms = 1;
        this.is_mouse_down_left = false;
        this.clicked_on = null;
        this.prev_cursor_x = 0;
        this.time_cell_selected = null;
        this.running_time_cell = null;
        this.time_caret = null;
        this.steps_by_minutes = [1, 2, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440];
        this.gt_height = 0;
        this.draw_new_timecell_obj = null,
        this.draw_new_timecell_mousedown = null,
        this.dialogInputValueObj = {},
        this.minute_per_graduation=null,
        this.init(element, options);
        return this;
    };
    TimeSlider.DEFAULTS = {
        start_hour_min_seconds :"00:00:00",//TODO 在验证有效性时,如果只输入小于24小时的数字,自动转化为例如10:00:00这种形式,类推,如果输入10:20,自动转化为10:20:00
        start_timestamp: (new Date("2016-12-19 00:00:00")).getTime(),   // left border //(new Date(this.static_date_string)).getTime()
        current_timestamp: (new Date(this.static_date_string)).getTime(), // current timestamp
        hours_per_ruler : 24,                   //一把尺子上有几个小时 length of graduation ruler in hours (min 1, max 48)
        graduation_step : 10,                   //每一小格多少分钟 minimum pixels between graduations
        distance_between_gtitle : 50,           //刻度间间隔 minimum pixels between titles of graduations
        update_timestamp_interval : 1000,       // 时间同步时间间隔 interval for updating current time
        update_interval: 1000,                  // interval for updating elements
        show_ms: false,                         //是否显示微秒 whether to show the milliseconds?
        show_time_cursor:true,                  //是否显示当前时间的红色游标
        init_cells: null,                       //list of time cells or function
        ruler_enable_move: true,
        timecell_enable_move: true,
        timecell_enable_resize: true,
        on_add_timecell_callback: null,
        on_toggle_timecell_callback: null,
        on_remove_timecell_callback: null,
        on_remove_all_timecells_callback: null,
        on_dblclick_timecell_callback: null,
        on_move_timecell_callback: null,
        on_resize_timecell_callback: null,
        on_change_timecell_callback: null,
        on_dblclick_ruler_callback: null,
        on_move_ruler_callback: null,
        on_change_ruler_callback: null,
        draw_new_timecell_flag:null,
        draw_new_timecell_start_x:null,
        static_time:24,//固定24小时


        /**
         * 2017-02-21
         *
         * */
        hours_per_ruler : 24,                    //一把尺子上有几个小时 length of graduation ruler in hours (min 1, max 48)
        graduation_step : 10,                    //每一小格多少分钟 minimum pixels between graduations
        distance_between_gtitle : '5px',         //刻度间间隔 minimum pixels between titles of graduations










    };
    TimeSlider.prototype.init = function(element, options) {
        this.$element = $(element);
        this.$element.append('<div class="graduation-title" style="display:none">init</div>');
        this.gt_height = this.$element.find('.graduation-title').height();
        //console.log(this.gt_height);
        this.$element.find('.graduation-title').remove();
/*        this.$element.append(
            '<div class="ruler" style = "height:' + (this.$element.height() + this.gt_height) + 'px;"></div>' +
            '<div class="prompts" style = "top:-' + (this.$element.height() * 2 + this.gt_height) + 'px;"></div>'
        );*/
        this.$element.append(
            '<div class="ruler" style = ""></div>' +
            '<div class="prompts" style = "top:-' + (this.$element.height() * 2 + this.gt_height) + 'px;"></div>'
        );
        this.$element.height(this.$element.height() + this.gt_height);
        this.$ruler = this.$element.find('.ruler');
        this.$prompts = this.$element.find('.prompts');

        this.options = this.get_options(options);

        this.add_graduations2();

/*      if (this.$element.attr('start_timestamp')) {
            options['start_timestamp'] = parseInt(this.$element.attr('start_timestamp'));
        }
        if (this.$element.attr('current_timestamp')) {
            this.frozen_current_timestamp = options['current_timestamp'] = parseInt(this.$element.attr('current_timestamp'));
        }*/

/*      this.options = this.get_options(options);

        this.px_per_ms = this.$element.width() / (this.options.hours_per_ruler * 3600 * 1000);

        //append background color and event layout
        this.$ruler.append (
            '<div class="bg"></div>' +
            '<div class="bg-event' + (this.options.ruler_enable_move ? '' : 'disable-move') + '"></div>'
        );
        this.add_graduations();

        if (this.options.init_cells) {
            if (typeof this.options.init_cells == 'function') {
                this.options.init_cells.bind(this).call();
            }
            else {
                this.add_cells(this.options.init_cells);
            }
        }
        this.add_events();*/

    };

    TimeSlider.prototype.get_options = function (options) {
        options = $.extend({}, this.get_defaults(), options);
        return options;
        //return this.validate_options(options);
    };

    //todo
    TimeSlider.prototype.validate_options = function (options){
        if(options['start_hour_min_seconds'].length < 8){
            if(options['start_hour_min_seconds'].length == 7){
                options['start_hour_min_seconds'] = options['start_hour_min_seconds'].substr(0,6)+"00"
            }else if(options['start_hour_min_seconds'].length < 7 && options['start_hour_min_seconds'].length > 5){

            }
        }
    };
//尺子的总长度:this.options.hours_per_ruler * 60 * this.options.distance_between_gtitle / graduation_step ;
    TimeSlider.prototype.add_graduations2 = function (){
        var temp;
        var left = 10;
        console.log("this.options.hours_per_ruler:" + this.options.hours_per_ruler + ",this.options.graduation_step:"+this.options.graduation_step);
        for(var i = 0 ; i < this.options.hours_per_ruler; i++){
            this.$ruler.append ('<div id = "temp'+i+'" class="temp" style="border:1px solid blue;width:1px;height:20px;background: #cccccc;width:1px;position: absolute"></div>');
            for(var j = 0 ; j < this.options.graduation_step; j++){
                this.$ruler.append ('<div id = "temp'+i+'" class="temp" style="position : absolute;width:1px;height:20px;background: #cccccc;left:'+(left * i).toString()+'px"></div>');
            }
        }
    }

    TimeSlider.prototype.add_graduations = function() {
        var leftMove = 40;
        var px_per_minute = this.$ruler.width() / (this.options.hours_per_ruler * 60);//每分钟多少像素
        var px_per_step = this.options.graduation_step;//每一格多少分钟
        var min_step = px_per_step / px_per_minute;//每个像素多少分钟
        for (var i = 0; i < this.steps_by_minutes.length; i++) {
            if (min_step <= this.steps_by_minutes[i]) {
                min_step = this.steps_by_minutes[i];
                px_per_step = min_step * px_per_minute;
                break;
            }
        }
        this.minute_per_graduation = min_step;
        //this.minute_per_graduation = null,

        var medium_step = 30;
        for (var i = 0; i < this.steps_by_minutes.length; i++) {
            if (this.options.distance_between_gtitle / px_per_minute <= this.steps_by_minutes[i]) {
                medium_step = this.steps_by_minutes[i];
                break;
            }
        }

        var ms_offset = this.ms_to_next_step(this.options.start_timestamp, min_step * 60 * 1000);
        var minute_caret = this.options.start_timestamp + ms_offset - (min_step * 60 * 1000) * 4;
        var num_steps = this.$ruler.width() / px_per_step;
        var date;
        var caret_class;
        var left;

        for (var i = -4; i <= num_steps; i++) {
            if(i == 0){
                //leftMove = 15;
            }else if(i == num_steps){
                //leftMove = 52;
            }else {
                leftMove = 40;
            }
            caret_class = '';
            date = new Date(minute_caret);
            left = i * px_per_step + this.px_per_ms * ms_offset;
            if (date.getHours() == 0 && date.getMinutes() == 0) {
                caret_class = 'big';
            }
            else if (minute_caret / (60 * 1000) % medium_step == 0) {
                caret_class = 'middle';
            }
            this.$ruler.append('<div id="hour' + i + '" class="graduation ' + caret_class + '" style="left: ' + left.toString() + 'px"></div>');
            if(i == num_steps){
                this.$ruler.append(
                    '<div id="graduation-title-hour' + i + '" class="graduation-title' + (caret_class ? '' : ' hidden') + '" style="left:' + (left - leftMove).toString() + 'px">' +
                    '23:59:59' +
                    '</div>'
                );
            }else{
                this.$ruler.append(
                    '<div id="graduation-title-hour' + i + '" class="graduation-title' + (caret_class ? '' : ' hidden') + '" style="left:' + (left - leftMove).toString() + 'px">' +
                    this.graduation_title(date) +
                    '</div>'
                );
            }
            minute_caret += min_step * 60 * 1000;
        }
    };

    TimeSlider.prototype.get_defaults = function() {
        return TimeSlider.DEFAULTS;
    };
    /**
     * 2017-02-21
     *
     *
     * */
    TimeSlider.prototype.timeStringToNumber = function(TimeString) {
        // first check the TimeString validity
        if(this.CheckTimeString(TimeString)){
           var arr = TimeString.split(":");
           var number = arr[0] * 1 + arr[1] * 100 + arr[2] * 10000 ;
           return number ;
        }else{
           return 0 ;
        }
    };

    TimeSlider.prototype.CheckTimeString = function (TimeString){
        var len = this.getStringLength(TimeString);

        if(len == 8 && TimeString.charAt(2) == ':' && TimeString.charAt(5) == ':'  ){
            return true;
        }else {
            return false;
        }
    }
    TimeSlider.prototype.getStringLength = function (str){
        var len = 0;
        for (var i=0; i<str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }
        return len;
    }

    // TIMESLIDER PLUGIN DEFINITION
    // ============================

    function Plugin(options, timecell) {
        return this.each(function() {
            var _this = $(this);
            var data = _this.data('timeslider');
            if (!data) {
                _this.data('timeslider', new TimeSlider(_this, options));
            }
            else {
                if (typeof options == 'string') {
                    switch (options) {
                        case 'get_all':
                            data.get_all_timecells();
                            break;
                        case 'add':
                            data.add_timecell(timecell);
                            break;
                        case 'toggle':
                            data.toggle_timecell(timecell);
                            break;
                        case 'edit':
                            data.edit_timecell(timecell);
                            break;
                        case 'remove':
                            data.remove_timecell(timecell);
                            break;
                        case 'remove_all':
                            data.remove_all_timecells();
                            break;
                        case 'new_start_timestamp':
                            data.set_new_start_timestamp(timecell);
                            break;
                    }
                }
                else {
                    data.set_options(options);
                }
            }
        });
    }

    var old = $.fn.TimeSlider;

    $.fn.TimeSlider = Plugin;
    $.fn.TimeSlider.VERSION = TimeSlider.VERSION;

    $.fn.TimeSlider.noConflict = function() {
        $.fn.TimeSlider = old;
        return this;
    };
})(jQuery);