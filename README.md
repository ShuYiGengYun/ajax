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
