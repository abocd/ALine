/**
 * Created by aboc on 16-6-5.
 */

function CLine(dom){
    /**
     * 在哪个dom上绘线
     */
    this.dom = dom;
    this.canvas = document.getElementById(this.dom);
    this.canvasContext = this.canvas.getContext("2d");
    /**
     * 线对象
     * @type {[]}
     */
    this.lineObject = [];
    /**
     * dom的宽度
     * @type {*|jQuery}
     */
    this.maxWidth = $('#'+dom).width();
    /**
     * dom的高度
     * @type {*|jQuery}
     */
    this.maxHeight = $('#'+dom).height();
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

    this.init = function(){
        if(!this.canvasContext){
            console.error("getContext('2d') fail");
            return;
        }
    };

    /**
     * 处理最大坐标位置
     * @param x
     * @param y
     * @returns {{x: *,  y: *}}
     * @private
     */
    this._dealMaxWidthHeight = function(x, y) {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > this.maxWidth)x = this.maxWidth;
        if (y > this.maxHeight)y = this.maxHeight;
        x = parseFloat(x.toFixed(3));
        y = parseFloat(y.toFixed(3));
        return {x: x, y: y};
    };


    /**
     * 简单绘线
     * @param x0  起点x坐标
     * @param y0  起点y坐标
     * @param x1  终点x坐标
     * @param y1  终点y坐标
     * @param param 参数
     * @returns {ALine}
     */
    this.drawLine = function (x0, y0, x1, y1 ,param) {
        param = param || {};
        //var flag = typeof param.flag!="undefined" ?param.flag : this.rand(6);
        var flag = param.flag || this.rand(6);
        var __ret = this._dealMaxWidthHeight(x0, y0);
        x0 = __ret.x;
        y0 = __ret.y;
        __ret = this._dealMaxWidthHeight(x1,y1);
        x1 = __ret.x;
        y1 = __ret.y;
        var isNew = -1;
        for(var i in this.lineObject){
            if(this.lineObject[i].flag === flag){
                isNew = i;
                continue;
            }
        }
        var data = {
            start:[x0,y0],
            stop:[x1,y1],
            width:param.width || 1,
            color:param.color || '#000',
            flag:flag
        };
        if(isNew >= 0){
            this.lineObject[i] = data;
        } else {
            this.lineObject.push(data);
        }
        this.method = 'drawLine';
        return this;
    };

    this.point = function(point) {
        this.pointParam = point || {};
        
        return this;
    }

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



    this.show = function(){
        //this.canvasContext.save();
        for(var i in this.lineObject){
            var l = this.lineObject[i];
            this.canvasContext.beginPath();
            this.canvasContext.lineWidth = l.width;
            this.canvasContext.strokeStyle = l.color;
            this.canvasContext.moveTo(l.start[0], l.start[1]);
            this.canvasContext.lineTo(l.stop[0], l.stop[1]);
            this.canvasContext.stroke();
        }
    }

}