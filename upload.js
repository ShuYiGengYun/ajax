(function(window, undefined) {
	
	function upload(selector, request) {
		return new Upload(selector, request);
	}
	
	var Upload = function(selector, request) {
		this.init(selector);
		this.request = request;
	}
	
	Upload.prototype.init = function(selector) {
		this.form = document.getElementById(selector);
		//alert(selector);
		//alert(this.form.innerHTML);
	};
	
	Upload.prototype.send = function() {
		var xhr = getXhr();
		var request = this.request;
		var formData = new FormData(this.form);
		xhr.open(request.method, request.url);
		xhr.send(formData);
	};
	
	function getXhr() {
		var xhr = null;
		if(window.XMLHttpRequest){
			xhr = new XMLHttpRequest();
		}
		else if(window.ActiveXObject){
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}

		return xhr;
	}
	
	window.Upload = upload;
})(window);