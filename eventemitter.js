
/**
   author:weber yang
   2015.7.31
   �������ģ��EventEmitter��ʵ�֣���չ�˲��ֹ��ܣ�����˶���ʵ���ٷ��Ĵ����Ĺ��ܣ�
   ʹ�÷�ʽ��������EventEmiiter���ơ�
**/
;(function (window, undefined) {
	'use strict';
	/*���캯��*/
	var EventEmitter = function() {
		this.events = {};//�������񣬴洢�ṹΪ{'eventName1':[{listener:function�����ĺ���, time:�����Ĵ���}], 'eventName2':[],}
	};
	
	EventEmitter.prototype.once = function(evt, listener) {
		 return this.addListener(evt, listener, 0);
	};
	/*��ȡ���е�����*/
	EventEmitter.prototype.getEvents = function() {
		return this.events || (this.events = {});
	}
	/*��ȡĳ��ʵ�������д�������*/
	EventEmitter.prototype.getListeners = function(evt) {
		 var events = this.getEvents();
		 return events[evt] || (events[evt] = []);
	};
	/**
	  ע��ʵ����������
	  evet:�¼�����
	  listener:�¼���������
	  time:��ѡ��ѡ����Դ����Ĵ�����-1��ʾ�����Σ�Ĭ��Ϊ-1
	**/
	EventEmitter.prototype.on = function(evt, listener, time) {
		time = typeof(time) == 'number' ? time : -1;
		time = time >= -1 ? time : -1; 
		var listeners = this.getListeners(evt);
		var listenerWrapper = {
			listener:listener,
			time:time,
		};
		listeners.push(listenerWrapper);
		
        return this;
	};
	/*addListener ��on ͬ�� */
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	/*�Ƴ��¼������м�������*/
	EventEmitter.prototype.off = function(evt) {
		var events = this.getEvents();
		events[evt] = [];
	};
	EventEmitter.prototype.removeEvent = EventEmitter.prototype.off;
	
	/**
	  ��ɾ��ͬһ�¼��е�����listener
	**/
	EventEmitter.prototype.removeListener = function(evt, listener) {
		var listeners = this.getListeners(evt);
		for(var i=0; i<listeners.length; i++) {
			if(listeners[i].listener == listener) {
				delete listeners[i];
			}
		}
	};
	/**
	  �����¼�
	**/
	EventEmitter.prototype.trigger = function(evt, args) {
		var listeners = this.getListeners(evt);
		for(var i=0; i<listeners.length; i++){
			var listener = listeners[i];
			if(listener.time != -1) {
				listener.time--;
			}
			if (listener.time == 0) {
				this.removeListener(evt, listener.listener);//����ͬ�����첽ִ��
			}
			listener.listener.apply(this, args || []);
		}
	};
	EventEmitter.prototype.fire = EventEmitter.prototype.trigger;
	/**
	  �����¼�
	**/
	EventEmitter.prototype.emit = function(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.trigger(evt, args);
    };
	
	EventEmitter.inherit = function(target) {
		
		if(typeof(target.prototype) == 'undefined') {
			throw 'target:' + target + 'must have prototype';
		}
		var souPto = EventEmitter.prototype;
		var tarPto = target.prototype;
		for(var key in souPto) {
			tarPto[key] = souPto[key];
		}
		return target;
	};
	
	window.EventEmitter = EventEmitter;
	
})(window);
    