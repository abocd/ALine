# ALine画线、标注插件
[^HTML划线]

#####作者:aboc Email:mayinhua@gmail.com

[我的php之旅](http://www.phpec.org)



##ALine画线、标注插件使用说明

1. 引入JS文件

```javascript

   <script type="text/javascript" src="src/jquery.min.js"></script>
   <script type="text/javascript" src="src/ALine.js"></script>
```

2. 初始化ALine

```javascript

   var demo1 = new ALine('#demo1');
```
3. 进行画线

```javascript
var demo2 = new ALine('#demo2');
      //横线
      demo2.init({color:'#666'}).angleLine(50,150,100,150).show();
      //竖线
      demo2.init({color:'#777'}).angleLine(150,50,150,250).show();
      //直角
      demo2.init({color:'#888'}).angleLine(250,100,350,200).show();
      //曲线
      demo2.init({color:'#999'}).coolLine(400,100,500,200).show();
```

```javascript
var demo3 = new ALine('#demo3');
      //横线
      demo3.init({color:'#666'}).angleLine(50,150,100,150).point().show();
      //竖线
      demo3.init({color:'#777'}).angleLine(150,50,150,250).point({width:8}).show();
      //直角
      demo3.init({color:'#888'}).angleLine(250,100,350,200).point({width:10}).show();
      //曲线
      demo3.init({color:'#999'}).coolLine(400,100,500,200).point({width:12}).show();
```
```javascript
var demo4 = new ALine('#demo4');
      //横线
      demo4.init({color:'#666',canDrag:true}).angleLine(50,150,100,150).point().show();
      //竖线
      var demo4 = new ALine('#demo4');
      demo4.init({color:'#777',canDrag:true}).angleLine(150,50,150,250).point({width:8}).show();
      //直角
      var demo4 = new ALine('#demo4');
      demo4.init({color:'#888',canDrag:true}).angleLine(250,100,350,200).point({width:10}).show();
      //曲线
      var demo4 = new ALine('#demo4');
      demo4.init({color:'#999',canDrag:true}).coolLine(400,100,500,200).point({width:12}).show();
```
```javascript
var demo5 = new ALine('#demo5');
      //横线
      demo5.init({color:'#666',canDrag:true}).angleLine(50,150,100,150).label("横线").point().show();
      //竖线
      var demo5 = new ALine('#demo5');
      demo5.init({color:'#777',canDrag:true}).angleLine(150,50,150,250).label("竖线").point({width:8}).show();
      //直角
      var demo5 = new ALine('#demo5');
      demo5.init({color:'#888',canDrag:true}).angleLine(250,100,350,200).label("直角").point({width:10}).show();
      //曲线
      var demo5 = new ALine('#demo5');
      demo5.init({color:'#999',canDrag:true}).coolLine(400,100,500,200).label("曲线").point({width:12}).show();
```
```javascript
var demo6 = new ALine('#demo6');
      //横线
      demo6.init({color:'#666',canDrag:true,callback:function(){
              //current_anchor = {class:arguments[0],start:arguments[1],stop:arguments[2]}
              $("#demo6_memo1").html("当前创建的类为："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html());
              },clickCallback:function(){
        $("#demo6_click").html("您点击了类："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html())
      }
      }).angleLine(50,150,100,150).label("横线").point().show();
      //竖线
      var demo6 = new ALine('#demo6');
      demo6.init({color:'#777',canDrag:true,callback:function(){
      //current_anchor = {class:arguments[0],start:arguments[1],stop:arguments[2]}
      $("#demo6_memo2").html("当前创建的类为："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html());
      },clickCallback:function(){
        $("#demo6_click").html("您点击了类："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html())
      }}).angleLine(150,50,150,250).label("竖线").point({width:8}).show();
      //直角
      var demo6 = new ALine('#demo6');
      demo6.init({color:'#888',canDrag:true,callback:function(){
      //current_anchor = {class:arguments[0],start:arguments[1],stop:arguments[2]}
      $("#demo6_memo3").html("当前创建的类为："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html());
      },clickCallback:function(){
        $("#demo6_click").html("您点击了类："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html())
      }}).angleLine(250,100,350,200).label("直角").point({width:10}).show();
      //曲线
      var demo6 = new ALine('#demo6');
      demo6.init({color:'#999',canDrag:true,callback:function(){
      //current_anchor = {class:arguments[0],start:arguments[1],stop:arguments[2]}
      $("#demo6_memo4").html("当前创建的类为："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html());
      },clickCallback:function(){
        $("#demo6_click").html("您点击了类："+arguments[0]+" , 标签文字为："+$("."+arguments[0]+".line_label").html())
      }}).coolLine(400,100,500,200).label("曲线").point({width:12}).show();
```


### 具体的各种参数就不说了，见演示
演示地址:[https://abocd.github.io/ALine/demo.html](https://abocd.github.io/ALine/demo.html)