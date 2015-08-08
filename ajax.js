
/*
  ajax 封装
  weber
  2015/7/5
  目前仅支持发送JSON数据,XML和html没有处理
  Ajax的返回结果异常没有处理提
*/

;(function(window, undefined) {

	function ajax(request, cbObject){
		 return new Ajax(request, cbObject);
	}
	//Ajax类定义
	/*request:
	   { method:请求的方法{GET,POST,PUT,DELETE},
	     requestType:发送信息至服务器时内容编码类型,{默认值"application/x-www-form-urlencoded",'multipart/form-data', 'request payload'}
		 原生默认：Content-Type为text/plain;charset=UTF-8，而请求表单参数在RequestPayload中
		 responseType:,{"" (空字符串),"arraybuffer","blob","document","json"(默认),"text"}
	     params:请求参数{DOMString:string(default)、Document:doc、FormData:formDate、Blob:blob、File:file、ArrayBuffer:buffer}
	   }
	*/
	//cbObject:回调对象{before(), success(result), after(), error(xhr, textStatus, error)}
	var RequestTypes = {
		default:'application/x-www-form-urlencoded;charset=utf-8;',
	};
	var Ajax = function(request, cbObject) {

		this.init(request, cbObject);
		return this;
	};

	//初始化参数
	Ajax.prototype.init = function(request, cbObject){

		var _req = request ? request : {};
		_req.method = _req.method ? _req.method : 'GET';
		_req.requestType = _req.requestType ? _req.requestType : 'application/x-www-form-urlencoded;charset=utf-8;';
		_req.responseType = _req.responseType ? _req.responseType : 'json';
		if(!(_req.params instanceof Document) && !(_req.params instanceof FormData)
			&& !(_req.params instanceof Blob) && !(_req.params instanceof ArrayBuffer)) {
			_req.params = _req.params ? MdataConvert(_req.params) : null;
			console.log(_req.params);
		}
		this.request = _req;
		this.headers = {};//暂时存储set的Header,等到要发送请求的时候写入xhr
		this.cbObject = cbObject;//回调对象
		this.xhr = getXhr();//初始化xhr
		this.xhr.responseType = _req.responseType;
	};
	/**
	send({DOMString、Document、FormData、Blob、File、ArrayBuffer})
	**/
	Ajax.prototype.send = function(callback){

		var cbObject = this.cbObject;
		if(cbObject.before) {
			if(!cbObject.before()) {
				return false;
			}
		}

		var xhr = this.xhr;
		var request = this.request;
		if(request.method.toUpperCase() == 'GET') {
			request.url = request.url + '?' + toQueryString(request.params);
			request.params = null;
		}
		else if(request.method.toUpperCase() == 'POST' && !request.params instanceof Blob) {
			request.params = toQueryString(request.params);
		}
		xhr.open(request.method, request.url);
		//判断请求数据类型
		this.setHeader('Content-type', request.requestType);
		
		this.writeHeader();//把请求太写入xhr
		console.log(request.params.get('radio'))
		xhr.send(request.params);
		
		var responseType = request.responseType;
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200 || xhr.status == 304) {
					var result = xhr.response;//设置xhr的responseType属性后就从这里取返回值
					//var result = xhr.responseText || xhr.responseXML || xhr.response;
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
	//{"" (空字符串),"arraybuffer","blob","document","json","text"}
	Ajax.prototype.setResponseType = function(type){
		this.xhr.responseType = type;
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
			this.xhr.setRequestHeader(key, headers[key]);
		}
	};
	Ajax.prototype.overrideMimeType = function(mimetype){
		this.xhr.overrideMimeType(mimetype);
	};
	
	Ajax.prototype.setTimeout = function(time){
		this.xhr.timeout = time;
	};
	
	Ajax.prototype.onTimeout = function(fn){
		this.xhr.ontimeout = fn;
	};
	//下载，event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0。
	Ajax.prototype.onDownProgress = function(fn){
		this.xhr.onprogress = fn;
	};
	//上传
	Ajax.prototype.onUploadProgress = function(fn){
		this.xhr.upload.onprogress = fn;
	};
	//传输成功完成
	Ajax.prototype.onLoad = function(fn){
		this.xhr.load = fn;
	};
	//传输被用户取消
	Ajax.prototype.onAbort = function(fn){
		this.xhr.abort = fn;
	};
	Ajax.prototype.abort = function(fn){
		this.xhr.abort.apply(this.xhr);
	};
	//传输中出现错误
	Ajax.prototype.onError = function(fn){
		this.xhr.error = fn;
	};
	//传输开始
	Ajax.prototype.onLoadstart = function(fn){
		this.xhr.loadstart = fn;
	};
	//传输结束，但是不知道成功还是失败
	Ajax.prototype.onLoadEnd = function(fn){
		this.xhr.loadEnd = fn;
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
		var prefix = arguments[1] ? objName : '';
		var output = {};
		switch (Mtypeof(data)) {
			case 'Object':
				prefix = prefix.length>0 ? (prefix + '.') : '';
			for(var key in data){
				if(Mtypeof(data[key]) == 'String') {
					output[prefix + key] = data[key];
				}
				else {
					merge(output, MdataConvert(data[key], prefix + key));
				}
			}
			break;
			case "Array":
			for(var i=0; i<data.length; i++){
				if(Mtypeof(data[i]) == 'String') {
					output[prefix + '[' + i + ']'] = data[i];
				}
				else {
					merge(output, MdataConvert(data[i], prefix + '[' + i + ']'));
				}
			}
			break;
			default:
			output[prefix] = data.toString();
			break;
		}
		return output;
	}
	//和nodejs的merge一样,把source的属性拷贝给target,会发生覆盖
	function merge(target, source) {
		if (target && source) {
			for (var key in source) {
				target[key] = source[key];
			}
		}
		return target;
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
			if ((typeof (data) === 'object') && (data instanceof Array)) {
				for (i = 0; i < value.length; i++) {
					push(key, value[i]);
				}
			} else {
				push(key, data[key]);
			}
		}
		return query.replace(/&$/, '').replace(/%20/g, '+');
	}

	window.ajax = ajax;
})(window);