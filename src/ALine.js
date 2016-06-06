/**
 * Created by aboc on 16-5-6. QQ:9986584
 *
 * http://git.oschina.net/niantang/ALine
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
    this.lineClass = '';
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
     * 标签样式
     * @type {string}
     */
    this.labelStyle = '';
    /**
     * 点样式
     * @type {string}
     */
    this.pointStyle = '';
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
     * 线是否可以画出当前dom外
     * @type {boolean}
     */
    this.overStep = false;
    /**
     * 标签是否可以拖出当前dom外
     * @type {boolean}
     */
    this.labelOverStep = true;
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
    /**
     * 是否调试模式
     * @type {boolean}
     */
    this.debug = false
    /**
     * 多边形数量
     * @type {number}
     */
    this.polygonNum = 0;
    /**
     * 多边形的点
     * @type {Array}
     */
    this.polygonPoint = [];
    /**
     * 多边形半径比例
     * @type {number}
     */
    this.radiusRate = 0.3;
    //var o = this;
    if( $(dom).css("position") !== "relative" ){
        $(dom).css("position", "relative");
    }
    /**
     * 初始化
     * @param param
     * @returns {ALine}
     */
    this.init = function (param) { //color,oldClass,appendClass
        param = param || {};
        var color = param.color || '#666';
        var oldClass = param.oldClass || 'al_' +this.rand(6);
        var appendClass = param.appendClass || '';
        if(typeof param.overStep !== "undefined"){
            this.overStep = param.overStep;
        }
        if(typeof param.labelOverStep !== "undefined"){
            this.labelOverStep = param.labelOverStep;
        }
        if(typeof param.canDrag !== "undefined"){
            this.canDrag = param.canDrag;
        }
        if(typeof param.debug !== "undefined"){
            this.debug = param.debug;
        }
        this.lineClass =  oldClass;
        this.html = '';
        this.initStyle = '.'+this.lineClass+'{position:absolute;line-height:1px;overflow:hidden;z-index:99998}.'+this.lineClass+'.al_one{width:1px;height:1px;}';
        this.initStyle += '.' + this.lineClass + '{background-color:' + color + '}';
        this.appendClass = ' ' + (appendClass || '');
        this.callback = typeof param.callback !== "undefined" ?param.callback : '';
        this.clickCallback = typeof param.clickCallback !== "undefined" ?param.clickCallback : '';
        if(this.canDrag) {
            this.draging[this.lineClass] = null;
            this.drag();
        }
        if(typeof this.clickCallback === "function"){
            var clickCallback = this.clickCallback;
            $("body").delegate("."+this.lineClass+".al_label","click",function(){
                var allclass = $(this).attr("class");
                var m = allclass.match(/aline_(\w+)/);
                if(m!== null && m.length === 2) {
                    clickCallback.call(this, "aline_"+m[1]);
                }
            });
        }
        return this;
    };
    /**
     * 简单绘线
     * @param x0  起点x坐标
     * @param y0  起点y坐标
     * @param x1  终点x坐标
     * @param y1  终点y坐标
     * @returns {ALine}
     */
    this.drawLine = function (x0, y0, x1, y1 ,extClass) {
        extClass = extClass || '';
        var __ret = this._dealMaxWidthHeight(x0, y0);
        x0 = __ret.x;
        y0 = __ret.y;
        __ret = this._dealMaxWidthHeight(x1,y1);
        x1 = __ret.x;
        y1 = __ret.y;
        if(this.start.length === 0){
            this.start = [x0,y0];
            this.stop = [x1,y1];
        }
        var rs = " ";
        if (y0 === y1){ //横线
            if(x0 > x1){
                var temp = x1;
                x1 = x0;
                x0 = temp;
            }
            rs = " <div class='" + this.lineClass +this.appendClass+ extClass +"' style= 'height:1px;width:" + Math.abs(x1 - x0).toFixed(3) + "px;top: " + y0 + "px;left: " + x0 + "px;'></div>";
        }
        else if (x0 === x1){ //竖线
            //console.info('old x0',x0,'y0',y0,'x1',x1,'y1',y1);
            if(y0 > y1){
                var temp = y1;
                y1 = y0;
                y0 = temp;
            }
            //console.info('new x0',x0,'y0',y0,'x1',x1,'y1',y1);
            rs = " <div class='" + this.lineClass +this.appendClass+ extClass + "' style= 'width:1px;height:" + Math.abs(y1 - y0).toFixed(3) + "px;top: " + y0 + "px;left: " + x0 + "px;'></div>";
        } else {
            var lx = x1 - x0;
            var ly = y1 - y0;
            var l = Math.sqrt(lx * lx + ly * ly);
            rs = [];
            for (var i = 0; i < l; i += 1) {
                var p = i / l;
                var px = parseFloat((x0 + lx * p).toFixed(3));
                var py = parseFloat((y0 + ly * p).toFixed(3));
                rs[rs.length] = " <div class='al_one " + this.lineClass +this.appendClass+ extClass + "' style= 'top: " + py + "px;left: " + px + "px;'></div> ";
            }
            rs = rs.join(" ");
        }
        this.html += rs;
        this.method = 'drawLine';
        return this;
    };
    /**
     * 拖动方法
     */
    this.drag = function(){
        var o = this;
        $("."+this.lineClass+".al_point").live("mousedown",function(e){
            o.draging[o.lineClass] = this;
            if($(this).hasClass("polygon_point")){
                o.dragObj = 'polygon';
            }
            else if($(this).hasClass("start_point")){
                //起点
                o.dragObj = 'start';
            } else {
                //终点
                o.dragObj = 'stop';
            }
            e.preventDefault();
        });
        $(this.dom).mousemove(function(e){
            if(o.draging[o.lineClass]) {
                var location = o.getMouseLoction(e);
                if(o.dragObj === 'polygon'){
                    var id = $(o.draging[o.lineClass]).data("id");
                    o.polygonPoint[id] = [location[0], location[1]];
                    var next_id = id - 1;
                    if(next_id<0){
                        next_id = o.polygonPoint.length-1;
                    }
                    o._updatePointLocation("."+ o.lineClass+"[data-id="+id+"]",o.polygonPoint[id][0],o.polygonPoint[id][1]);
                    o.clearPolygonLine("l_"+id).clearPolygonLine("l_"+next_id);
                    o._polygonLine(id)._polygonLine(next_id);
                    o.method = 'polygon';
                    o.show();

                } else if(o.dragObj === 'start'){
                    if(o.method === 'coolLine') {
                        o.reset(o.lineClass).coolLine(location[0], location[1], o.stop[0], o.stop[1]).point(o.pointParam).show();
                    } else {
                        o.reset(o.lineClass).angleLine(location[0], location[1], o.stop[0], o.stop[1]).point(o.pointParam).show();
                    }
                } else {
                    //console.info("=====",location);
                    var __ret = o._dealMaxWidthHeightHaveLabel( location[0],location[1]);
                    location[0] = __ret.x1;
                    location[1] = __ret.y1;
                    //console.info("-----",location);
                    if(o.method === 'coolLine') {
                        o.reset(o.lineClass).coolLine(o.start[0], o.start[1], location[0], location[1]).point(o.pointParam).show();
                    } else {
                        o.reset(o.lineClass).angleLine(o.start[0], o.start[1], location[0], location[1]).point(o.pointParam).show();
                    }
                }
                if(o.debug){
                    console.info("线",o.lineClass,"起点坐标", o.start[0], o.start[1],"终点坐标", o.stop[0], o.stop[1]);
                }
            }
            e.preventDefault();
        }).mouseup(function(e){
            o.draging[o.lineClass] = null;
            e.preventDefault();
        });
    };
    /**
     * 绘制起点终点的方法
     * @param point
     * @returns {ALine}
     */
    this.point = function(point){
        this.pointParam = point || {};
        this.pointParam.width = typeof this.pointParam !== "undefined" && typeof this.pointParam.width !== "undefined" ?this.pointParam.width : 5;
        this.pointParam.border =typeof this.pointParam !== "undefined" && typeof this.pointParam.border !== "undefined" ? this.pointParam.border : 1;
        this.pointParam.bgcolor = typeof this.pointParam !== "undefined" && typeof this.pointParam.bgcolor !== "undefined" ?this.pointParam.bgcolor : '#ccc';
        this.pointParam.bordercolor =typeof this.pointParam !== "undefined" && typeof this.pointParam.bordercolor !== "undefined" ? this.pointParam.bordercolor : '#efefef';
        this.pointStyle = '.'+this.lineClass+'.al_point{width:'+this.pointParam.width+'px !important;height:'+this.pointParam.width+'px !important;z-index:99999;border-radius:'+(this.pointParam.width*1+this.pointParam.border*1)+'px;border:'+this.pointParam.border+'px solid '+this.pointParam.bordercolor+';background-color:'+this.pointParam.bgcolor+'  !important}';
        if(this.method !== 'polygon') {
            this._startEndPoint();
        } else {
            this._polygonPoint();
        }
        return this;
    };

    /**
     * 起点终点的原点
     * @private
     */
    this._startEndPoint = function(){
        var x,y;
        if (this.start.length) {
            x = this.start[0].toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
            y = this.start[1].toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
            this.html += " <div class='" + this.lineClass + this.appendClass + " al_point start_point' style= 'top: " + y + "px;left: " + x + "px;'></div> ";
        }
        if (this.stop.length) {
            x = this.stop[0].toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
            y = this.stop[1].toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
            this.html += " <div class='" + this.lineClass + this.appendClass + " al_point stop_point' style= 'top: " + y + "px;left: " + x + "px;'></div> ";
        }
    }

    /**
     * 多边形的圆点
     * @private
     */
    this._polygonPoint = function(){
        var x,y;
        for(var i in this.polygonPoint){
            x = this.polygonPoint[i][0].toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
            y = this.polygonPoint[i][1].toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
            this.html += " <div class='" + this.lineClass + this.appendClass + " al_point polygon_point' data-id='"+i+"' style= 'top: " + y + "px;left: " + x + "px;'></div> ";
        }
    }
    /**
     * 修改点坐标
      * @param selector
     * @param x
     * @param y
     * @private
     */
    this._updatePointLocation = function(selector,x,y){
        x = x.toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
        y = y.toFixed(3) - (this.pointParam.width + this.pointParam.border * 1) / 2;
        $(selector).css({
            left:x,
            top:y
        });
    }

    /**
     * 画多边形
     * @data data  intger/array
     * @data radiusRate float   半径比例，当num = 为数字时，radisu为0.1-0.4，默认0.3
     */
    this.polygon = function(data ,radiusRate){
        if(typeof data === "number"){
            if(data<3 || data >10){
                console.error("多边形的边数为3～10个");
                return false;
            }
            this.polygonNum = data;
            this.radiusRate = radiusRate || 0.3;
            if(this.radiusRate<0.1 || this.radiusRate>0.4){
                console.error("radius参数设置错误");
                return false;
            }
            //找出几根线
            //中心点
            var centerPoint = [this.maxWidth/2,this.maxHeight/2];
            var radius = this.radiusRate * (this.maxHeight < this.maxWidth ?this.maxHeight : this.maxWidth);
            //console.info(this.radiusRate,radius,centerPoint)
            //每个角度
            var angle = 360/this.polygonNum;
            data = []; //重新修正param为数组
            var x = 0, y = 0;
            if(this.polygonNum%2 ===0 ){
                //偶数
                //var referencePoint = [centerPoint[0],centerPoint[1] - radius * Math.sin(45) ];
                x = centerPoint[0]+radius*Math.sin(2*Math.PI/360*(angle/2));
                y = centerPoint[1]-(radius*Math.sin(2*Math.PI/360*(90-angle/2)));
            } else{
                //奇数
                x = centerPoint[0];
                y = centerPoint[1]-radius;//1
            }
            x = parseFloat(x.toFixed(3));
            y = parseFloat(y.toFixed(3));
            data.push([x,y]);
            //找到余下的几个点
            for(var i=1;i<this.polygonNum;i++){
                //当前点角度
                var realAngle = (angle/2) *(this.polygonNum%2 ? 0 : 1) +i*angle;
                if(realAngle <= 90){
                    x = centerPoint[0] + radius * Math.sin(2*Math.PI/360*realAngle);
                    y = centerPoint[1] - radius * Math.sin(2*Math.PI/360*(90-realAngle));
                }
                else if(realAngle <= 180){
                    realAngle -= 90;
                    x = centerPoint[0] + radius * Math.sin(2*Math.PI/360*(90-realAngle));
                    y = centerPoint[1] + radius * Math.sin(2*Math.PI/360*(realAngle));
                }
                else if(realAngle <= 270){
                    realAngle -= 180;
                    x = centerPoint[0] - radius * Math.sin(2*Math.PI/360*realAngle);
                    y = centerPoint[1] + radius * Math.sin(2*Math.PI/360*(90-realAngle));
                } else {
                    realAngle -= 270;
                    x = centerPoint[0] - radius * Math.sin(2*Math.PI/360*(90-realAngle));
                    y = centerPoint[1] - radius * Math.sin(2*Math.PI/360*(realAngle));
                }
                x = parseFloat(x.toFixed(3));
                y = parseFloat(y.toFixed(3));
                data.push([x,y]);
            }
        }else if(typeof data === "array" || typeof data === "object"){
            this.polygonNum = data.length;
            if(this.polygonNum<3 || this.polygonNum>10){
                console.error("多边形的边数为3～10个");
                return false;
            }
        } else {
            console.error("未知的参数");
            return false;
        }
        this.polygonPoint = data;
        for(var i in data){
            this._polygonLine(i);
        }
        //console.info(typeof data,data)
        this.method = 'polygon';
        return this;
    }
    /**
     * 画多边形里面的线
     * @param index
     * @private
     */
    this._polygonLine = function(index){
        index = parseInt(index);
        if(index<(this.polygonNum-1)){
            this.drawLine(this.polygonPoint[index][0],this.polygonPoint[index][1],this.polygonPoint[index+1][0],this.polygonPoint[index+1][1]," l_"+index);
        }else{
            this.drawLine(this.polygonPoint[index][0],this.polygonPoint[index][1],this.polygonPoint[0][0],this.polygonPoint[0][1]," l_"+index);
        }
        return this;
    }

    /**
     * 处理最大坐标位置
     * @param x
     * @param y
     * @returns {{x: *,  y: *}}
     * @private
     */
    this._dealMaxWidthHeight = function(x, y) {
        if(!this.overStep) {
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > this.maxWidth)x = this.maxWidth;
            if (y > this.maxHeight)y = this.maxHeight;
        }
        x = parseFloat(x.toFixed(3));
        y = parseFloat(y.toFixed(3));
        //console.info($("."+this.lineClass+".al_label"));
        return {x: x, y: y};
    };

    /**
     * 处理最大坐标位置,带标签
     * @param x1
     * @param y1
     * @returns {{x0: *, x1: *, y0: *, y1: *}}
     * @private
     */
    this._dealMaxWidthHeightHaveLabel = function( x1, y1) {
        //console.info($("."+this.lineClass+".al_label").length,!this.labelOverStep,"=");
        if($("."+this.lineClass+".al_label").length > 0 && !this.labelOverStep) {
            console.info("dododo",this.pointParam,+this.pointParam.width/2+this.pointParam.border)
            var label = $("." + this.lineClass + ".al_label");
            var labelWidth = $(label).width()+this.pointParam.width/2+this.pointParam.border+13;
            var labelHeight = $(label).height()+2;
            if (x1 < labelWidth) x1 = labelWidth;
            if (y1 < labelHeight / 2) y1 = labelHeight / 2;
            if (x1 > this.maxWidth - labelWidth)x1 = this.maxWidth - labelWidth;
            if (y1 > this.maxHeight - labelHeight / 2)y1 = this.maxHeight - labelHeight / 2;
        }
        x1 = parseFloat(x1.toFixed(3));
        y1 = parseFloat(y1.toFixed(3));
        //console.info($("."+this.lineClass+".al_label"));
        return {x1: x1, y1: y1};
    };

    /**
     * 画比较酷的线，斜线和直线
     *
     * @param x0  起点x坐标
     * @param y0  起点y坐标
     * @param x1  终点x坐标
     * @param y1  终点y坐标
     * @returns {ALine}
     */
    this.coolLine = function(x0, y0, x1, y1){
        var __ret = this._dealMaxWidthHeight(x0, y0);
        x0 = __ret.x;
        y0 = __ret.y;
        __ret = this._dealMaxWidthHeight(x1,y1);
        x1 = __ret.x;
        y1 = __ret.y;
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
            this.drawLine(x0,y0, center[0],center[1]).drawLine(center[0],center[1],x1,y1);
        } else {
            this.drawLine(x0,y0,x1,y1);
        }
        this.method = 'coolLine';
        return this;
    };
    /**
     * 重置绘线，用于新绘线
     * @param resetClass
     * @returns {ALine}
     */
    this.reset = function(resetClass){
        resetClass = resetClass || this.lineClass;
        $("." + resetClass+":not(.al_label)").remove();
        $(".style" + resetClass).remove();
        this.html = '';
        this.style = '';
        return this;
    };
    /**
     * 直角线
     * @param x0  起点x坐标
     * @param y0  起点y坐标
     * @param x1  终点x坐标
     * @param y1  终点y坐标
     * @returns {ALine}
     */
    this.angleLine = function(x0, y0, x1, y1){
        var __ret = this._dealMaxWidthHeight(x0, y0);
        x0 = __ret.x;
        y0 = __ret.y;
        __ret = this._dealMaxWidthHeight(x1,y1);
        x1 = __ret.x;
        y1 = __ret.y;
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
            this.drawLine(x0,y0, center[0],center[1]).drawLine(center[0],center[1],x1,y1);
        } else {
            this.drawLine(x0,y0,x1,y1);
        }
        this.method = 'angleLine';
        return this;
    };
    /**
     * 绘制标签
     * @param title
     * @param param
     * @returns {ALine}
     */
    this.label = function(title,param){
        param = param || {};
        var height = typeof param.height !== "undefined" ? param.height :20;
        var style = typeof param.style !== "undefined" ? param.style :'';
        this.labelStyle = '.'+this.lineClass+'.al_label{height:'+height+'px;line-height:'+height+'px;background-color:#fff;border-radius:3px;border:1px solid #efefef;padding:0 5px;'+style+';white-space:nowrap;}';
        if($("."+this.lineClass+".al_label").length===0){
            this.html += " <div class='" + this.lineClass +this.appendClass+ " al_label' style= 'display: none;'>"+title+"</div> ";
        }
        return this;
    };
    /**
     * 修改标签文字
     * @param lineClass
     * @param title
     */
    this.setLabelTitle = function(lineClass,title){
        $("."+lineClass+".al_label").html(title);
        var info = this._getInfo(lineClass);
        this._setLablePosition(lineClass,info[0],info[1]);
    };
    /**
     * 显示绘线
     */
    this.show = function () {
        //console.info(this)
        if($('.style'+this.lineClass).length>0){
            $('.style'+this.lineClass).html(this.initStyle + this.style + this.pointStyle + this.labelStyle);
        } else {
            $(this.dom).append('<style class="style' + this.lineClass + '">' + this.initStyle + this.style + this.pointStyle + this.labelStyle + '</style>');
        }
        if($("."+this.lineClass+":not(.al_label)").length>0){
            if(this.dragObj === 'polygon'){
                $(this.dom).append(this.html);
            } else {
                $("." + this.lineClass).show();
            }
        } else {
            $(this.dom).append(this.html);
        }
        if($("."+this.lineClass+".al_label").length && this.start.length>0 && this.stop.length>0) {
            this._setLablePosition(this.lineClass,this.pointParam,{start:this.start,stop:this.stop});
            $("." + this.lineClass + ".al_label").show();
        }
        if(typeof this.callback === "function"){
            if(this.method == 'polygon'){
                //console.info(this.polygonPoint);
                this.callback.call({}, this.lineClass, this.polygonPoint);
            } else {
                this.callback.call({}, this.lineClass, this.start, this.stop);
            }
        }
        if(this.debug){
            console.info("线",this.lineClass,"起点坐标", this.start[0], this.start[1],"终点坐标", this.stop[0], this.stop[1]);
        }
    };

    /**
     * 设置标签位置
     * @private
     */
    this._setLablePosition = function(lineClass,pointParam,startStop){
        var left = startStop.stop[0];
        var top = startStop.stop[1];
        var lable_width = $("."+lineClass+".al_label").width();
        var lable_height = $("."+lineClass+".al_label").height();
        if(startStop.start[0] > startStop.stop[0]){
            //left =
            left -= (lable_width + (pointParam.width+pointParam.border)/2+13);
        } else {
            left += ((pointParam.width+pointParam.border)/2+3);
        }
        top -= lable_height/2;
        $("." + lineClass + ".al_label").css({
            left: left,
            top: top,
        });
        return this;
    };
    /**
     * 获取相关坐标点信息
     *
     * @returns {ALine}
     * @private
     */
    this._getInfo = function(lineClass){
        var pointParam = {
            width:parseInt($("."+lineClass+".al_point").width()),
            border:parseInt($("."+lineClass+".al_point").css("borderWidth"))
        };
        var correcting = (pointParam.width+pointParam.border*2)/2;
        var startStop = {
            start : [parseInt($("." + lineClass + ".start_point").css("left")) + correcting, parseInt($("." + lineClass + ".start_point").css("top")) + correcting],
            stop : [parseInt($("." + lineClass + ".stop_point").css("left")) + correcting, parseInt($("." + lineClass + ".stop_point").css("top")) + correcting]
        }
        return [pointParam,startStop];
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
            if (j === 1) {
                str += Math.ceil(Math.random() * 9);
            } else if (j === 2) {
                str += String.fromCharCode(Math.ceil(Math.random() * 25 + 65));
            } else {
                str += String.fromCharCode(Math.ceil(Math.random() * 25 + 97));
            }
        }
        return str;
    };
    /**
     * 清除某个class的线及标签
     * @param clearClass
     */
    this.clear = function (clearClass) {
        clearClass = clearClass || this.lineClass
        $("." + clearClass).remove();
        $(".style" + clearClass).remove();
        this.html = '';
        this.style = '';
        this.lineClass = '';
    };
    /**
     * 清除当前类下面的特定的线
     * @param extClass
     */
    this.clearPolygonLine = function(extClass){
        //console.info("."+this.lineClass+"."+extClass)
        $("."+this.lineClass+"."+extClass).remove();
        this.html = '';
        this.style = '';
        return this;
    }
    /**
     * 获取鼠标坐标
     * @param e
     * @returns {*[]}
     */
    this.getMouseLoction = function(e){
        //console.info(e);
        var offset = $(this.dom).offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [x,y];
    };
}

