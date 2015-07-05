
/*
  ajax 封装
  weber
  2015/7/5
  目前仅支持发送JSON数据,XML和html没有处理
  Ajax的返回结果异常没有处理提
*/

(function(window, undefined) {

	function ajax(request, cbObject){
		 return new Ajax(request, cbObject);
	}
	//Ajax类定义
	//request:{method:请求的方法.GET等,type:发送的数据类型,例如JSON,params:请求参数,例如字符串,对象,或者数组}
	//cbObject:回调对象{before(), success(result), after(), error(xhr, textStatus, error)}
	var Ajax = function(request, cbObject) {

		this.init(request, cbObject);
		return this;
	};

	//初始化参数
	Ajax.prototype.init = function(request, cbObject){

		var _req = request ? request : {};
		_req.method = _req.method ? _req.method : 'GET';
		_req.type = _req.type ? _req.type : 'JSON';
		_req.params = _req.params ? MdataConvert(_req.params) : null;
		this.request = _req;

		this.headers = {};//暂时存储set的Header,等到要发送请求的时候写入xhr

		this.cbObject = cbObject;//回调对象

		this.xhr = getXhr();//初始化xhr
	};

	Ajax.prototype.send = function(callback){

		var cbObject = this.cbObject;
		if(cbObject.before) {
			if(!cbObject.before()) {
				return false;
			}
		}

		var xhr = this.xhr;
		var request = this.request;
		if(request.method != 'POST') {
			request.url = request.url + '?' + toQueryString(request.params);
			request.params = null;
		}
		xhr.open(request.method, request.url);
		//判断请求数据类型
		if(request.type == 'JSON'){
			this.setHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
		}
		else if(request.type == 'XML'){
			this.setHeader('Content-type', 'application/xml; charset=UTF-8');
		}
		else {
			this.setHeader('Content-type', 'text/html; charset=UTF-8');
		}
		this.writeHeader();//把请求太写入xhr
		xhr.send(JSON.stringify(request.params));

		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200 || xhr.status == 304) {
					var result = xhr.responseText || xhr.responseXML;
					cbObject.success(result);
				}
				else {
					if(cbObject.error) {
						cbObject.error(xhr, xhr.textStatus, error);
					}
				}
			}
		};

		if(cbObject.after) {
			cbObject.after();
		}
	};
	//设置单个请求头,重复会覆盖
	Ajax.prototype.setHeader = function(key, value){
		this.headers[key] = value;
	};
	//获取单个请求头,不存在返回undefined
	Ajax.prototype.getHeader = function(key){
		return this.headers[key];
	};
	//设置单个请求头,{}的形式
	Ajax.prototype.setHeaders = function(hObj){
		for(var key in hObj) {
			this.headers[key] = hObj[key];
		}
	};
	//获取所有的请求头
	Ajax.prototype.getHeaders = function(){
		return this.headers;
	};
	//把缓存的请求头写入xhr
	Ajax.prototype.writeHeader = function(){
		var headers = this.headers;
		var xhr = this.xhr;
		for(var key in headers) {
			xhr.setRequestHeader(key, headers[key]);
		}
	};

	//跨浏览器获取xhr,不支持Ajax返回null
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
	//数据类型获取
	var Mtypeof = function(source){
		var typeofString = Object.prototype.toString.call(source);
		return typeofString.substring(typeofString.lastIndexOf("\ ") + 1, typeofString.lastIndexOf("\]"));
	}
	//数据类型转换
	var MdataConvert = function(objData, objName){
		var data = arguments[0] ? objData : {};
		var prefix = arguments[1] ? objName : "";
		var output = {};
		switch (Mtypeof(data)) {
			case "Object":
				prefix = prefix.length>0 ? (prefix+".") : "";
			for(var key in data){
				if(Mtypeof(data[key]) == "String") {
					output[prefix + key] = data[key];
				}
				else {
					merge(output, MdataConvert(data[key], prefix + key));
				}
			}
			break;
			case "Array":
			for(var i=0; i<data.length; i++){
				if(Mtypeof(data[i]) == "String") {
					output[prefix + "[" + i + "]"] = data[i];
				}
				else {
					merge(output, MdataConvert(data[i], prefix + "[" + i + "]"));
				}
			}
			break;
			default:
			output[prefix] = data.toString();
			break;
		}
		return output;
	}
	//把对象的数据转换成&形式的string
	function toQueryString(data) {
		var query = '', i,
			push = function (key, value) {
			query += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
			}, key, value;
			
			for (key in data) {
				if (!Object.hasOwnProperty.call(data, key)) {
					continue;
			}
			
			value = data[key];
			if ((typeof (data) === "object") && (data instanceof Array)) {
				for (i = 0; i < value.length; i++) {
					push(key, value[i]);
				}
			} else {
				push(key, data[key]);
			}
		}
		return query.replace(/&$/, '').replace(/%20/g, '+');
	}

	//和nodejs的merge一样,把source的属性拷贝给target,会发生覆盖
	function merge(target, source) {
		if (target && source) {
			for (var key in source) {
				key[key] = source[key];
			}
		}
		return target;
	}

	window.ajax = ajax;
})(window);