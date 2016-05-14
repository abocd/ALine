/**
 * Created by aboc on 16-5-6. QQ:9986584
 *
 */

function ALine(dom) {
    /**
     * 用于绘线的html代码
     * @type {string}
     */
    this.html = '';
    /**
     * 所绘线的类
     * @type {string}
     */
    this.lineclass = '';
    /**
     * 自定义样式
     * @type {string}
     */
    this.style = '';
    /**
     * 初始化样式
     * @type {string}
     */
    this.initStyle = '';
    /**
     * 起点坐标
     * @type {Array}
     */
    this.start = [];
    /**
     * 终点坐标
     * @type {Array}
     */
    this.stop = [];
    /**
     * 用户追加的类
     * @type {string}
     */
    this.appendClass = '';
    /**
     * 是否能拖动
     * @type {boolean}
     */
    this.canDrag = false;
    /**
     * 拖动的对象
     * @type {{}}
     */
    this.draging = {};
    /**
     * 拖动对象的类型 起点还是终点
     * @type {string}
     */
    this.dragObj = '';
    /**
     * 是否可以画出当前dom外
     * @type {boolean}
     */
    this.overStep = false;
    /**
     * 绘线后的回调函数
     * @type {string}
     */
    this.callback = '';
    /**
     * 点击线后的回调函数
     * @type {string}
     */
    this.clickCallback = '';
    /**
     * 在哪个dom上绘线
     */
    this.dom = dom;
    /**
     * dom的宽度
     * @type {*|jQuery}
     */
    this.maxWidth = $(dom).width();
    /**
     * dom的高度
     * @type {*|jQuery}
     */
    this.maxHeight = $(dom).height();
    /**
     * 起点、终点的参数
     * @type {{}}
     */
    this.pointParam = {};
    /**
     * 最后执行的方法
     * @type {string}
     */
    this.method = '';
    //var o = this;
    if( $(dom).css("position") == "relative" ){
        $(dom).css("position", "relative");
    }
    /**
     * 初始化
     * @param param
     * @returns {ALine}
     */
    this.init = function (param) { //color,Class,appendClass
        param = param || {};
        var color = param.color || '#666';
        var oldClass = param.oldClass || 'aline_' +this.rand(6);
        var appendClass = param.appendClass || '';
        if(typeof param.overStep != "undefined"){
            this.overStep = param.overStep;
        }
        if(typeof param.canDrag != "undefined"){
            this.canDrag = param.canDrag;
        }

        this.lineclass =  oldClass;
        this.html = '';
        this.initStyle = '.'+this.lineclass+'{position:absolute;line-height:1px;overflow:hidden;z-index:99998}';
        this.initStyle += '.' + this.lineclass + '{background-color:' + color + '}';
        this.appendClass = ' ' + (appendClass || '');
        this.callback = typeof param.callback != "undefined" ?param.callback : '';
        this.clickCallback = typeof param.clickCallback != "undefined" ?param.clickCallback : '';
        if(this.canDrag) {
            this.draging[this.lineclass] = null;
            this.drag();
        }
        if(typeof this.clickCallback == "function"){
            o = this;
            $("body").delegate("."+this.lineclass,"click",function(){
                var allclass = $(this).attr("class");
                var m = allclass.match(/aline_(\w+)/);
                if(m!= null && m.length == 2) {
                    o.clickCallback.call({}, "aline_"+m[1]);
                }
            });
        }
        return this;
    };
    /**
     * 简单绘线
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @returns {ALine}
     */
    this.drawLine = function (x0, y0, x1, y1) {
        if(!this.overStep) {
            if (x0 < 0) x0 = 0;
            if (x1 < 0) x1 = 0;
            if (y0 < 0) y0 = 0;
            if (y1 < 0) y1 = 0;
            if (x0 > this.maxWidth)x0 = this.maxWidth;
            if (x1 > this.maxWidth)x1 = this.maxWidth;
            if (y0 > this.maxHeight)y0 = this.maxHeight;
            if (y1 > this.maxHeight)y1 = this.maxHeight;
        }
        x0 = parseFloat(x0.toFixed(3));
        y0 = parseFloat(y0.toFixed(3));
        x1 = parseFloat(x1.toFixed(3));
        y1 = parseFloat(y1.toFixed(3));
        if(this.start.length == 0){
            this.start = [x0,y0];
            this.stop = [x1,y1];
        }
        var rs = " ";
        if (y0 == y1){ //横线
            if(x0 > x1){
                var temp = x1;
                x1 = x0;
                x0 = temp;
            }
            rs = " <div class='" + this.lineclass +this.appendClass+ "' style= 'height:1px;width:" + Math.abs(x1 - x0).toFixed(3) + "px;top: " + y0 + "px;left: " + x0 + "px;'></div>";
        }
        else if (x0 == x1){ //竖线
            //console.info('old x0',x0,'y0',y0,'x1',x1,'y1',y1);
            if(y0 > y1){
                var temp = y1;
                y1 = y0;
                y0 = temp;
            }
            //console.info('new x0',x0,'y0',y0,'x1',x1,'y1',y1);
            rs = " <div class='" + this.lineclass +this.appendClass+ "' style= 'width:1px;height:" + Math.abs(y1 - y0).toFixed(3) + "px;top: " + y0 + "px;left: " + x0 + "px;'></div>";
        } else {
            var lx = x1 - x0;
            var ly = y1 - y0;
            var l = Math.sqrt(lx * lx + ly * ly);
            rs = [];
            for (var i = 0; i < l; i += 1) {
                var p = i / l;
                var px = x0 + lx * p;
                var py = y0 + ly * p;
                rs[rs.length] = " <div class='" + this.lineclass +this.appendClass+ "' style= 'width:1px;height:1px;top: " + py + "px;left: " + px + "px;'></div> ";
            }
            rs = rs.join(" ");
        }
        this.html += rs;
        return this;
    };
    /**
     * 拖动方法
     */
    this.drag = function(){
        var o = this;
        $("."+this.lineclass+".line_point").live("mousedown",function(e){
            o.draging[o.lineclass] = this;
            if($(this).hasClass("start_point")){
                //起点
                o.dragObj = 'start';
            } else {
                //终点
                o.dragObj = 'stop';
            }
            e.preventDefault();
        });
        $(this.dom).mousemove(function(e){
            if(o.draging[o.lineclass]) {
                var location = o.getLoction(e);
                //console.info(location);
                if(o.dragObj == 'start'){
                    if(o.method == 'coolLine') {
                        o.reset(o.lineclass).coolLine(location[0], location[1], o.stop[0], o.stop[1]).point(o.pointParam).show();
                    } else {
                        o.reset(o.lineclass).angleLine(location[0], location[1], o.stop[0], o.stop[1]).point(o.pointParam).show();
                    }
                } else {
                    if(o.method == 'coolLine') {
                        o.reset(o.lineclass).coolLine(o.start[0], o.start[1], location[0], location[1]).point(o.pointParam).show();
                    } else {
                        o.reset(o.lineclass).angleLine(o.start[0], o.start[1], location[0], location[1]).point(o.pointParam).show();
                    }
                }
            }
            e.preventDefault();
        }).mouseup(function(e){
            o.draging[o.lineclass] = null;
            e.preventDefault();
        });
    }
    /**
     * 绘制起点终点的方法
     * @param point
     * @returns {ALine}
     */
    this.point = function(point){
        this.pointParam = point || {};
        this.pointParam.width = typeof this.pointParam != "undefined" && typeof this.pointParam.width != "undefined" ?this.pointParam.width : 5;
        this.pointParam.border =typeof this.pointParam != "undefined" && typeof this.pointParam.border != "undefined" ? this.pointParam.border : 1;
        this.pointParam.bgcolor = typeof this.pointParam != "undefined" && typeof this.pointParam.bgcolor != "undefined" ?this.pointParam.bgcolor : '#ccc';
        this.pointParam.bordercolor =typeof this.pointParam != "undefined" && typeof this.pointParam.bordercolor != "undefined" ? this.pointParam.bordercolor : '#efefef';
        this.style += this.style+'.'+this.lineclass+'.line_point{width:'+this.pointParam.width+'px !important;height:'+this.pointParam.width+'px !important;z-index:99999;border-radius:'+(this.pointParam.width*1+this.pointParam.border*1)+'px;border:'+this.pointParam.border+'px solid '+this.pointParam.bordercolor+';background-color:'+this.pointParam.bgcolor+'  !important}';
        if(this.start.length){
            var x = this.start[0].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            var y = this.start[1].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            this.html +=" <div class='" + this.lineclass +this.appendClass+ " line_point start_point' style= 'top: " + y + "px;left: " + x + "px;'></div> ";
        }
        if(this.stop.length){
            var x = this.stop[0].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            var y = this.stop[1].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            this.html +=" <div class='" + this.lineclass +this.appendClass+ " line_point stop_point' style= 'top: " + y + "px;left: " + x + "px;'></div> ";
        }
        return this;
    };
    //画比较酷的线，斜线和直线
    this.coolLine = function(x0, y0, x1, y1){
        this.method = 'coolLine';
        if(!this.overStep) {
            if (x0 < 0) x0 = 0;
            if (x1 < 0) x1 = 0;
            if (y0 < 0) y0 = 0;
            if (y1 < 0) y1 = 0;
            if (x0 > this.maxWidth)x0 = this.maxWidth;
            if (x1 > this.maxWidth)x1 = this.maxWidth;
            if (y0 > this.maxHeight)y0 = this.maxHeight;
            if (y1 > this.maxHeight)y1 = this.maxHeight;
        }
        this.start = [x0,y0];
        this.stop = [x1,y1];
        //要折线
        var x = Math.abs(x0-x1);
        var y = Math.abs(y0-y1);
        if( x > 50 && y > 50 ){
            if( x0 <= x1 ){
                var center = [ x1 - x/3 ,y1];
            } else {
                var center = [ x1 + x/3 ,y1];
            }
            //console.info(x0,y0,x1,y1)
            return this.drawLine(x0,y0, center[0],center[1]).drawLine(center[0],center[1],x1,y1);
        } else {
            return this.drawLine(x0,y0,x1,y1);
        }
    };
    /**
     * 重置绘线，用于新绘线
     * @param resetClass
     * @returns {ALine}
     */
    this.reset = function(resetClass){
        resetClass = resetClass || this.lineclass;
        $("." + resetClass+":not(.line_label)").remove();
        $(".style" + resetClass).remove();
        this.html = '';
        this.style = '';
        return this;
    }
    /**
     * 直角线
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @returns {ALine}
     */
    this.angleLine = function(x0, y0, x1, y1){
        this.method = 'angleLine';
        if(!this.overStep) {
            if (x0 < 0) x0 = 0;
            if (x1 < 0) x1 = 0;
            if (y0 < 0) y0 = 0;
            if (y1 < 0) y1 = 0;
            if (x0 > this.maxWidth)x0 = this.maxWidth;
            if (x1 > this.maxWidth)x1 = this.maxWidth;
            if (y0 > this.maxHeight)y0 = this.maxHeight;
            if (y1 > this.maxHeight)y1 = this.maxHeight;
        }
        this.start = [x0,y0];
        this.stop = [x1,y1];
        var x = Math.abs(x0-x1);
        var y = Math.abs(y0-y1);
        if(x || y) {
            if (x >= y) {
                var center = [x1, y0];
            } else {
                var center = [x0, y1];
            }
            return this.drawLine(x0,y0, center[0],center[1]).drawLine(center[0],center[1],x1,y1);
        } else {
            return this.drawLine(x0,y0,x1,y1);
        }
    };
    /**
     * 绘制标签
     * @param title
     * @param param
     * @returns {ALine}
     */
    this.label = function(title,param){
        if($("."+this.lineclass+".line_label").length==0){
            param = param || {};
            var height = typeof param.height != "undefined" ? param.height :20;
            var style = typeof param.style != "undefined" ? param.style :'';
            this.initStyle += '.'+this.lineclass+'.line_label{height:'+height+'px;line-height:'+height+'px;background-color:#fff;border-radius:3px;border:1px solid #efefef;padding:0 5px;'+style+'}';
            this.html += " <div class='" + this.lineclass +this.appendClass+ " line_label' style= 'display: none;'>"+title+"</div> ";
        }
        return this;
    }
    /**
     * 显示绘线
     */
    this.show = function () {
        //console.info(this)
        $(dom).append('<style class="style'+this.lineclass+'">'+this.initStyle+this.style+'</style>'+this.html);
        if($("."+this.lineclass+".line_label").length && this.start.length>0 && this.stop.length>0) {
            var left = this.stop[0];
            var top = this.stop[1];
            var lable_width = $("."+this.lineclass+".line_label").width();
            var lable_height = $("."+this.lineclass+".line_label").height();
            if(this.start[0] > this.stop[0]){
                //left =
                left -= (lable_width + (this.pointParam.width+this.pointParam.border)/2+13);
            } else {
                left += ((this.pointParam.width+this.pointParam.border)/2+3);
            }
            top -= lable_height/2;
            $("." + this.lineclass + ".line_label").css({
                left: left,
                top: top,
            }).show();
        }
        if(typeof this.callback == "function"){
            this.callback.call({},this.lineclass,this.start,this.stop);
        }
    };
    /**
     * 生成随机数
     * @param len
     * @param type
     * @returns {string}
     */
    this.rand = function (len, type) {
        len = len < 0 ? 0 : len;
        type = type && type <= 3 ? type : 3;
        var str = '';
        for (var i = 0; i < len; i++) {
            var j = Math.ceil(Math.random() * type);
            if (j == 1) {
                str += Math.ceil(Math.random() * 9);
            } else if (j == 2) {
                str += String.fromCharCode(Math.ceil(Math.random() * 25 + 65));
            } else {
                str += String.fromCharCode(Math.ceil(Math.random() * 25 + 97));
            }
        }
        return str;
    };
    /**
     * 清除某个class的线
     * @param clearClass
     */
    this.clear = function (clearClass) {
        clearClass = clearClass || this.lineclass
        $("." + clearClass).remove();
        $(".style" + clearClass).remove();
        this.html = '';
        this.style = '';
        this.lineclass = '';
    };
    /**
     * 获取鼠标坐标
     * @param e
     * @returns {*[]}
     */
    this.getLoction = function(e){
        //console.info(e);
        var offset = $(this.dom).offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [x,y];
    };
}

