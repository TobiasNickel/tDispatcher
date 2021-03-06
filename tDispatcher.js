/**
 * @author Tobias Nickel
 * @description minimalistic dispatcher, that fulfill the full requirement of a FLUX dispatcher.
 * @license MIT
 */

 /**
  * gives an object the ability to handle emittions by defining 4 attributes
  * ._events, .on, .off and .trigger
  */
var tDispatcher = (function(){
  function tDispatcher(){
		this._events= {dispatched:[]};
		this.isDispatching = false;
		this._actions = [];
  }

	/**
	 *	method that you will want to write in the documentation of your class/object.
	 *  together with all the events you trigger by yourself
	 *@param event {string} name of the event
	 *@param callback {function} the function to be called when the event is triggered
	 */
	tDispatcher.prototype.on = function on(store, callback) {
		if(typeof store == 'string'){
			store={
				event:store,
				name:(Math.random()* 0xFFFFFFFFFFFFF).toString(16)+''+(Math.random()* 0xFFFFFFFFFFFFF).toString(16),
				callback: callback
			}
		}
        // a store has minimum the properties event, name and callback
        //store = {
        //  event: '',
        //  name: 'name that others can require'
		// 	require: [] list of other name-strings
        //  callback: the method do call with the action
        //}

		if (!(store.event in this._events)){
			this._events[store.event] = {};
    }
		this._events[store.event][store.name] = store;
    this.addAction(store.name);
	};

	/**
	 *	method to remove an eventlistener or even all.
	 *@param event {string} name of the event where the call back should be removed
	 *@param callback {function} that will be removed from the listener
	 */
	tDispatcher.prototype.off = function off(event,/*name or callback*/ name) {
		if (!event) {
			this._events = {};
			return;
		}
		if (!name) {
			delete this._events[event];
		} else {
			if(this._events[event]){
				if("function" == typeof name){
					var events = this._events[event];
					for(var i in events){
						if(events[i].callback === name){
							delete events[i];
						}
					}
				}else{
					delete this._events[event][name];
				}
			}
		}
	};

	/**
	 *  executing all listener that are registered on the event
	 *@param event {string} name of the event to be triggered
	 *@args args {mixed} anything that you want to be passed to the listeners callback
	 */
	tDispatcher.prototype.trigger = function trigger(action,/*optional*/value) {
		if(typeof action === 'string'){
			action = {event:action};
    }
		if(value !== undefined){
			action.value=value;
    }
		if (!action.event) return;
		this._actions.push(action);
		if(this.isDispatching) return;

    this.isDispatching = true;
		while(action = this._actions.shift()){
      if (!this._events[action.event]){
        continue;
      }
			var solvedRoundCount = 1;
			var todoEvents = {};
			var events = this._events[action.event];
			for(var i in events){
				todoEvents[i] = events[i];
      }

			var done = {};
			while(solvedRoundCount != 0){
				solvedRoundCount = 0;
				for(var i in todoEvents) {
					if(todoEvents[i].require){
						var found=false;
						for(var r = 0; r<todoEvents[i].require.length; r++){
							if(!done[todoEvents[i].require[r]]){
								found=true;
								break;
							}
						}
						if(found)continue;
					}

					done[i]=true;
					todoEvents[i].callback(action);
					delete todoEvents[i];
					solvedRoundCount++;
				}
			}
    }
    var events = this._events["dispatched"];
    for(var i in events){
      events[i].callback();
    }
    this.isDispatching = false;
	};

  /**
   * create a method on the dispatcher, that dispatches the Event of the given name
   * @param name {string} the name of the Action and the method.
   */
  tDispatcher.prototype.addAction = function(name){
    if(!this[name]){
      this[name]=function(value){
        this.trigger('name', value);
      };
    }
  };

  return tDispatcher
})();

if('object' === typeof module){ module.exports=tDispatcher; }
//test
