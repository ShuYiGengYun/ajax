/**
  function:ajax提交表单
  version:v1.0
  author:weber yang
  date:2015.8.8
**/
;(function(window, undefined) {
	
	function form(request, selector) {
		
		return new Form(request, selector);
	}
	/*
	  request{url:请求路径, method:请求方法(GET默认,POST...), enctype:表单提交的类型,默认为application/x-www-form-urlencoded}
	  selector:样式选择器,可以手动过滤表单中需要提交的元素,例如'#form input,select,textarea'仅提交input和select和textarea的元素
	*/
	var Form = function(request, selector) {
		
		this.selector = selector;
		this.init(request);
		
		return this;
	};
	
	Form.prototype.init = function(req) {
		
		req.method = req.method ? req.method:'get';
		req.requestType = req.enctype ? req.enctype : 'application/x-www-form-urlencoded';
		this.request = req;
		
		//初始化表单控件存储,解析表单的时候会把input这样的控件放到这里
		this.inputs = {
			radios: new Array(),
			checkboxs: new Array(),
			files: new Array(),
			others: new Array(),
		};
		this.selects = new Array();
		this.textareas = new Array();
	};
	
	//解析表单
	Form.prototype.parseForm = function() {

		var elements = document.querySelectorAll(this.selector);
		for(var i=0; i<elements.length; i++) {
			var ele = elements[i];
			switch(ele.nodeName) {
				case 'INPUT':
				  this._handleInput(ele);
				break;
				case 'SELECT':
				  this._handleSelect(ele);
				break;
				case 'TEXTAREA':
				  this._handleTextarea(ele);
				break;
				default:break;
			}
		}
	}
	
	Form.prototype._handleInput = function(input) {
		
		if(input.type == 'reset' || input.type == 'submit' || input.type == 'button') {
			return ;
		}
		var inputs = this.inputs;
		switch(input.type) {
			case 'radio':
			   if(input.checked) {
				   inputs.radios.push(input);
			   }
			break;
			case 'checkbox':
			  if(!input.checked) {
				  break;
			  }
			  var checkboxs = inputs.checkboxs;
			  var checkbox = null;
			  for(var i=0; i<checkboxs.length;i++) {
				  if(checkboxs[i].name == input.name) {
					  checkbox = checkboxs[i];
					  break;
				  }
			  }
			  if(checkbox != null) {
				  checkbox.values = checkbox.values + ',' + input.value;
			  }
			  else {
				  input.values = input.value;
                  inputs.checkboxs.push(input);				  
			  }
			break;
			case 'file':
			   inputs.files.push(input);
			break;
			default:
			  inputs.others.push(input);
			break;
		}
	};
	
	Form.prototype._handleSelect = function(select) {
		var selects = this.selects;
		if(select.multiple) {
			var options = select.options;
			var values = '';
			for(var i=0; i<options.length; i++) {
				if(options[i].selected) {
					values = values + ',' + options[i].value;
				}
			}
			select.values = values;
		}
		selects.push(select);
	};
	
	Form.prototype._handleTextarea = function(textarea) {
		var textareas = this.textareas;
		textareas.push(textarea);
	};
	
	//序列化前面解析出来的表单元素
	Form.prototype.serialize = function(requestType) {
		
		var result = {};
		var i = 0;
		
		//1.input
		var radios = this.inputs.radios;
		for(i=0; i<radios.length; i++) {
			result[radios[i].name] = radios[i].value;
		}
		var checkboxs = this.inputs.checkboxs;
		for(i=0; i<checkboxs.length; i++) {
			result[checkboxs[i].name] = checkboxs[i].values;
		}
		var others = this.inputs.others;
		for(i=0; i<others.length; i++) {
			result[others[i].name] = others[i].value;
		}
		//2.select
		var selects = this.selects;
		for(i=0; i<selects.length; i++) {
			if(!selects[i].multiple) {
				result[selects[i].name] = selects[i].value;
			}
			else {
				result[selects[i].name] = selects[i].values;
			}
		}
		//3.textarea
		var textareas = this.textareas;
		for(i=0; i<textareas.length; i++) {
			result[textareas[i].name] = textareas[i].value;
		}
		
		if(this.inputs.files.length != 0 || requestType == 'multipart/form-data') {
			
			var fd = new FormData();
			var files = this.inputs.files;
			for(i=0; i<files.length; i++) {
				fd.append(files[i]);
			}
			for(var key in result) {
				fd.append(key, result[key]);
			}
			result = fd;
		}
		
		return result;
	};
	//发送请求,这里使用自己封装的ajax,详见本博客的ajax文章.
	Form.prototype.send = function() {
		
		var params = this.serialize(this.request.requestType);
		if(params instanceof Blob) {
			this.request.requestType = 'multipart/form-data';
		}
		this.request.params = params;
		console.log(params);
		
		ajax(
			this.request,
			{
			success:function(result) {
			alert(result)
		},
       }).send();
	   
	};
	//手动提交表单
	Form.prototype.submit = function() {
		
		this.parseForm();
		this.send();
	};
	
	window.form = form;

})(window);