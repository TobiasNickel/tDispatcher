// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

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
	tDispatcher.prototype.on = function on(store) {
        // a store has minimum the properties event, name and callback
        //store = {
        //  event: '',
        //  name: 'name that others can require'
		// 	require: [] list of other name-strings
        //  callback: the method do call with the action
        //}

		if (!(store.event in this._events))
			this._events[store.event] = {};
		this._events[store.event][store.name] = store;
	}
	/**
	 *	method to remove an eventlistener or even all.
	 *@param event {string} name of the event where the call back should be removed
	 *@param callback {function} that will be removed from the listener
	 */
	tDispatcher.prototype.off = function off(event, name) {
	    //todo: remove a store
		if (!event) {
			this._events = {};
			return;
		}
		if (!callback) {
			delete this._events[event];
		} else {
			delete this._events[event][name];
		}
	}
		/**
	 *  executing all listener that are registered on the event
	 *@param event {string} name of the event to be triggered
	 *@args args {mixed} anything that you want to be passed to the listeners callback
	 */
	tDispatcher.prototype.trigger = function trigger(action) {
		if(typeof action === 'string')
			action = {event:action};
	    //an action has minimum an event-property:
	    //action={
	    //     event    
	    //}
		if (!action.event) return;
		this._actions.push(action)
		if(this.isDispatching) return;

        this.isDispatching = true;
		while(action = this._actions.shift()){	
            if (!this._events[action.event])
                continue;
				
			var solvedRoundCount = 1;
			var todoEvents = {};
			var events = this._events[action.event];
			for(var i in events)
				todoEvents[i]=events[i];

			var done = {};
			while(solvedRoundCount != 0){
				solvedRoundCount = 0;
				for(var i in todoEvents) {
					if(todoEvents[i].require){
						var found=false;
						for(var r = 0;r<todoEvents[i].require.length;r++){
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


        var i = this._events["dispatched"].length;
        while (i--) {
            this._events["dispatched"][i](action);
        }
        this.isDispatching = false;
	}

    return tDispatcher
})();

//test
/*
var dispatcher = new tDispatcher();

dispatcher.on({event:'duAuchNoch',name:'nachzügler',callback:function(){console.log('nein mann, ich will noch nicht gehn')}})

dispatcher.on({event:'los',name:'nach her',require:['nagut'],callback:function(){console.log('nachher : nach : machdoch')}});

dispatcher.on({event:'los',name:'nagut',callback:function(){
    dispatcher.trigger({event:'duAuchNoch'});
    console.log('machdoch');
}});

dispatcher.trigger({event:'los'});

*/
/*
// on console you should see

machdoch
nachher : nach : machdoch
nein mann, ich will noch nicht gehn
*/