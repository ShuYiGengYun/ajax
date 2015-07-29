
;(function (window, undefined) {
	'use strict';
	
	var EventEmitter = function() {
		this.eventMapper = {};
	};
	
	EventEmitter.prototype.once = function(evt, listener) {
		 return this.addListener(evt, {
            listener: listener,
            once: true
        });
	};getEvents
	
	EventEmitter.prototype.getEvents = function() {
		return this.events || (this.events = {});
	}
	
	EventEmitter.getListeners = function getListeners(evt) {
		 var events = this.getEvents();
		 return events[evt] || (events[evt] = []);
	};
	
	EventEmitter.prototype.on = function(evt, listener, isOnce) {
		var listeners = this.getListeners(evt);
		var listenerWrapper = {
			listener:listener,
			once:false;
		};
		listeners.push(listenerWrapper);
		
        return this;
	};
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	EventEmitter.prototype.off = function(evt) {
		var events = this.getEvents();
		events[evt] = [];
	};
	EventEmitter.prototype.removeListener = EventEmitter.prototype.off;
	
	EventEmitter.prototype.removeEvent = function(evt) {
		var events = this.getEvents();
		events[evt] = null;
	};
	
	EventEmitter.prototype.trigger = function(evt, args) {
		var listeners = this.getListeners(evt);
		for(var i=0; i<listeners.length; i++){
			var listener = listenersp[i];
			if (listener.once === true) {
				this.removeListener(evt, listener.listener);//可以同步或异步执行
			}
			listener.listener.apply(this, args || []);
		}
	};
	EventEmitter.prototype.fire = EventEmitter.prototype.trigger;
	
	EventEmitter.prototype. = function(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.trigger(evt, args);
    };
	
	window.EventEmitter = EventEmitter;
	
})(window);
    