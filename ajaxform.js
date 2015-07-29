(function(window, undefined) {
	
	
	function form(selector, url, method) {
		
		return new Form(selector, url, method);
	}
	
	var Form = function(selector, url, method) {
		this.form = document.querySelector(selector);
		
		this.method = method;
		this.url = url;
		this.params = {};
		this.elements = {
			input:[],
			select:[],
			textarea:[],
		};
	};
	Form.ContrTypes = {
		//1.input
		button:0, checkbox:1, color:2, date:3, datetime:4, 'datetime-local':5,
		email:6, file:7, hidden:8, image:9, month:10, number:11,
		password:12, radio:13, range:14, reset:15, search:16,
		submit:17, tel:18, text:19, time:20, url:21, week:22,
		//2.select
		'select-one'30:,'select-multiple'31:,
		//3.textarea
		textarea:40,
	};
	Form.ContrFilter = {
		//1.button
		'button':0, 'reset':1, 'submit':2,
	};
	
	Form.prototype.init = function() {
		
	};
	
	Form.prototype.addParam = function(key, value) {
		this.params[key] = value;
		return this;
	};
	Form.prototype.addParams = function(pObj) {
		for(var key in pObj) {
			this.params[key] = pObj[key];
		}
		return this;
	};
	
	Form.prototype.parseForm() {
		var elements = this.elements;
		var rowEles = document.querySelectorAll(this.selector);
		for(var i=0; i<rowEles.length; i++) {
			var ele = rowEles[i];
			if((typeof(ContrTypes[ele.type]) != 'undefined') && (typeof(ContrFilter[ele.type]) == 'undefined')) {
				switch() {
					case 'input':
					break;
					case 'select':
					break;
					case 'textarea':
					break;
					default:break;
				}
			}
		}
	}
	
	Form.prototype.submit = function() {
	};
	
	window.form = form;
})(window);