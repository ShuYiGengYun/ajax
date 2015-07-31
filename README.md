# ajax
Ajax的封装

使用演示
 ajax({method:'POST',//POST
    type:'JSON',//JSON
    url:'http://localhost:3000/ajax',
    params:{name:'yzh', age:'23'},//[{name:'yhj', age:'22'},{name:'yzh', age:'23'}]
    }, {
    before:function() {
      //alert('before');
      return true;
    },
    success:function(result) {
      //alert(result);
    },
    }).send();

EventEmitter
浏览器端模拟EventEmitter的实现，拓展了部分功能，添加了定制实践促发的次数的功能，
使用方式和其他的EventEmiiter类似。

使用方法
var emit = new EventEmitter();
		
		emit.on('click', function() {
		  console.log('clcik');
		}, 2);
		emit.trigger('click');
		emit.trigger('click');
		emit.trigger('click');
 
