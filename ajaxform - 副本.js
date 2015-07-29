(function(window, undefined) {
	
	function form(selector, url, method) {
		
		return new Form(selector, url, method);
	}
	
	var Form = function(selector, url, method) {
		this.form = document.querySelector(selector);
		this.method = method;
		this.url = url;
		this.params = {};
	};
	
	Form.prototype.init = function() {
		
	};
	
	Form.prototype.addParameter = function(key, value) {
		this.params[key] = value;
		return this;
	};
	Form.prototype.addParameters = function(pObj) {
		for(var key in pObj) {
			this.params[key] = pObj[key];
		}
		return this;
	};
	
	Form.prototype.submit = function() {
		var formData = new FormData(this.form);
		var xhr = new XMLHttpRequest();
		xhr.open(this.method, this.url);
		//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.send(formData);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200 || xhr.status == 304) {
					var result = xhr.responseText || xhr.responseXML;
					alert(xhr.status);
				}
				else {
					alert(xhr.status);
				}
			}
		};
		
	};
	
	window.form = form;
})(window);