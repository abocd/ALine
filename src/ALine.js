/**
 * Created by aboc on 16-5-6. QQ:9986584
 *
 */

function ALine(dom) {
    this.html = '';
    this.class = '';
    this.style = '';
    this.initStyle = '';
    this.start = [];
    this.stop = [];
    this.appendClass = '';
    this.canDrag = false;
    this.draging = {};
    this.dragObj = '';
    this.overstep = false;
    this.callback = '';
    this.clickCallback = '';
    this.dom = dom;
    this.maxWidth = $(dom).width();
    this.maxHeight = $(dom).height();
    this.pointParam = {};
    this.method = '';
    //var o = this;
    if( $(dom).css("position") == "relative" ){
        $(dom).css("position", "relative");
    }
    this.init = function (param) { //color,Class,appendClass
        param = param || {};
        var color = param.color || '#666';
        var oldClass = param.oldClass || this.rand(6);
        var appendClass = param.appendClass || '';
        if(typeof param.overstep != "undefined"){
            this.overstep = param.overstep;
        }
        if(typeof param.canDrag != "undefined"){
            this.canDrag = param.canDrag;
        }

        this.class = 'aline_' + oldClass;
        this.html = '';
        this.initStyle = '.'+this.class+'{position:absolute;line-height:1px;overflow:hidden;z-index:99998}';
        this.initStyle += '.' + this.class + '{background-color:' + color + '}';
        this.appendClass = ' ' + (appendClass || '');
        this.callback = typeof param.callback != "undefined" ?param.callback : '';
        this.clickCallback = typeof param.clickCallback != "undefined" ?param.clickCallback : '';
        if(this.canDrag) {
            this.draging[this.class] = null;
            this.drag();
        }
        if(typeof this.clickCallback == "function"){
            o = this;
            $("body").delegate("."+this.class,"click",function(){
                var allclass = $(this).attr("class");
                var m = allclass.match(/aline_(\w+)/);
                if(m!= null && m.length == 2) {
                    o.clickCallback.call({}, "aline_"+m[1]);
                }
            });
        }
        return this;
    };
    this.drawLine = function (x0, y0, x1, y1) {
        if(!this.overstep) {
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
            rs = " <div class='" + this.class +this.appendClass+ "' style= 'height:1px;width:" + Math.abs(x1 - x0).toFixed(3) + "px;top: " + y0 + "px;left: " + x0 + "px;'></div>";
        }
        else if (x0 == x1){ //竖线
            //console.info('old x0',x0,'y0',y0,'x1',x1,'y1',y1);
            if(y0 > y1){
                var temp = y1;
                y1 = y0;
                y0 = temp;
            }
            //console.info('new x0',x0,'y0',y0,'x1',x1,'y1',y1);
            rs = " <div class='" + this.class +this.appendClass+ "' style= 'width:1px;height:" + Math.abs(y1 - y0).toFixed(3) + "px;top: " + y0 + "px;left: " + x0 + "px;'></div>";
        } else {
            var lx = x1 - x0;
            var ly = y1 - y0;
            var l = Math.sqrt(lx * lx + ly * ly);
            rs = [];
            for (var i = 0; i < l; i += 1) {
                var p = i / l;
                var px = x0 + lx * p;
                var py = y0 + ly * p;
                rs[rs.length] = " <div class='" + this.class +this.appendClass+ "' style= 'width:1px;height:1px;top: " + py + "px;left: " + px + "px;'></div> ";
            }
            rs = rs.join(" ");
        }
        this.html += rs;
        return this;
    };
    this.drag = function(){
        var o = this;
        $("."+this.class+".line_point").live("mousedown",function(e){
            o.draging[o.class] = this;
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
            if(o.draging[o.class]) {
                var location = o.getLoction(e);
                //console.info(location);
                if(o.dragObj == 'start'){
                    if(o.method == 'coolLine') {
                        o.reset(o.class).coolLine(location[0], location[1], o.stop[0], o.stop[1]).point(o.pointParam).show();
                    } else {
                        o.reset(o.class).angleLine(location[0], location[1], o.stop[0], o.stop[1]).point(o.pointParam).show();
                    }
                } else {
                    if(o.method == 'coolLine') {
                        o.reset(o.class).coolLine(o.start[0], o.start[1], location[0], location[1]).point(o.pointParam).show();
                    } else {
                        o.reset(o.class).angleLine(o.start[0], o.start[1], location[0], location[1]).point(o.pointParam).show();
                    }
                }
            }
            e.preventDefault();
        }).mouseup(function(e){
            o.draging[o.class] = null;
            e.preventDefault();
        });
    }
    this.point = function(point){
        this.pointParam = point || {};
        this.pointParam.width = typeof this.pointParam != "undefined" && typeof this.pointParam.width != "undefined" ?this.pointParam.width : 5;
        this.pointParam.border =typeof this.pointParam != "undefined" && typeof this.pointParam.border != "undefined" ? this.pointParam.border : 1;
        this.pointParam.bgcolor = typeof this.pointParam != "undefined" && typeof this.pointParam.bgcolor != "undefined" ?this.pointParam.bgcolor : '#ccc';
        this.pointParam.bordercolor =typeof this.pointParam != "undefined" && typeof this.pointParam.bordercolor != "undefined" ? this.pointParam.bordercolor : '#efefef';
        this.style += this.style+'.'+this.class+'.line_point{width:'+this.pointParam.width+'px !important;height:'+this.pointParam.width+'px !important;z-index:99999;border-radius:'+(this.pointParam.width*1+this.pointParam.border*1)+'px;border:'+this.pointParam.border+'px solid '+this.pointParam.bordercolor+';background-color:'+this.pointParam.bgcolor+'  !important}';
        if(this.start.length){
            var x = this.start[0].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            var y = this.start[1].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            this.html +=" <div class='" + this.class +this.appendClass+ " line_point start_point' style= 'top: " + y + "px;left: " + x + "px;'></div> ";
        }
        if(this.stop.length){
            var x = this.stop[0].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            var y = this.stop[1].toFixed(3)- (this.pointParam.width+this.pointParam.border*1)/2;
            this.html +=" <div class='" + this.class +this.appendClass+ " line_point stop_point' style= 'top: " + y + "px;left: " + x + "px;'></div> ";
        }
        return this;
    };
    //画比较酷的线
    this.coolLine = function(x0, y0, x1, y1){
        this.method = 'coolLine';
        if(!this.overstep) {
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
    this.reset = function(resetClass){
        resetClass = resetClass || this.class;
        $("." + resetClass+":not(.line_label)").remove();
        $(".style" + resetClass).remove();
        this.html = '';
        this.style = '';
        return this;
    }
    this.angleLine = function(x0, y0, x1, y1){
        this.method = 'angleLine';
        if(!this.overstep) {
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
    this.label = function(title,param){
        if($("."+this.class+".line_label").length==0){
            param = param || {};
            var height = typeof param.height != "undefined" ? param.height :20;
            var style = typeof param.style != "undefined" ? param.style :'';
            this.initStyle += '.'+this.class+'.line_label{height:'+height+'px;line-height:'+height+'px;background-color:#fff;border-radius:3px;border:1px solid #efefef;padding:0 5px;'+style+'}';
            this.html += " <div class='" + this.class +this.appendClass+ " line_label' style= 'display: none;'>"+title+"</div> ";
        }
        return this;
    }
    this.show = function () {
        //console.info(this)
        $(dom).append('<style class="style'+this.class+'">'+this.initStyle+this.style+'</style>'+this.html);
        if($("."+this.class+".line_label").length && this.start.length>0 && this.stop.length>0) {
            var left = this.stop[0];
            var top = this.stop[1];
            var lable_width = $("."+this.class+".line_label").width();
            var lable_height = $("."+this.class+".line_label").height();
            if(this.start[0] > this.stop[0]){
                //left =
                left -= (lable_width + (this.pointParam.width+this.pointParam.border)/2+13);
            } else {
                left += ((this.pointParam.width+this.pointParam.border)/2+3);
            }
            top -= lable_height/2;
            $("." + this.class + ".line_label").css({
                left: left,
                top: top,
            }).show();
        }
        if(typeof this.callback == "function"){
            this.callback.call({},this.class,this.start,this.stop);
        }
    };
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
    this.clear = function (clearClass) {
        clearClass = clearClass || this.class
        $("." + clearClass).remove();
        $(".style" + clearClass).remove();
        this.html = '';
        this.style = '';
        this.class = '';
    };
    this.getLoction = function(e){
        //console.info(e);
        var offset = $(this.dom).offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        return [x,y];
    };
}

