# tDispatcher
inspired by Facebooks Flux, I made a simpler dispatcher, with a more common API. 

So this project is for guys who are interested to use Flux and do it in a simple way, that might be familiar with other eventsystems.
I developed this framework, because I am up to start a new Project, with a lot of complex dataflows between client- and server-application.
My decision was already done, to use react. As I am familiar with Backbone and some other frameworks, I thought, how that could integrate with React. Many people use React together with Backbone and replace the views with React. I found, that the standart dispatcher in the Flux-Tutorial has many similarities with Backbone.event or my tMitter. So I changed the tMitter, to hit the queried behaviour as mention at the Flux Website.

## Description
This is an Event-system, where events are representing actions and listener can define other listener to be executed first.
It will execute one action on all corresponding callbacks, before computing the next action, that might be triggered by a callback.
It is possible for an listener to require that one or more Other listener have to be executed before. can also be used as middlewhere, to manipulate the action
As soon as all actions are computed, it will trigger an 'dispatched' event, to let views re-render the updated Data in the stores.

## API
All you need are three methods, maybe just two of them: on, off and trigger.
```js
	1. tDispatcher.on();// to register a listener,
		// it can be used as a in backbone event just .on('eventname',callback)
		//or better: an object, containing 
		{	event:'theEventname',
			name:'nameThatCanBeRequired',
			callback:function(){'toBeExecuted'},
			require:['module that is required']
		}
	
	2. tDispatcher.off;// to remove eventlistener. .off(), 
		//		without params will remove all listener on the Dispatcher
		.off(event) 
		//		will remove all listener for that event,(event is a string)
		.off(event, name) 
		//		the listener with that name
		.off(event,callback) 
		//		will the listener with the corresponding 
		//		callback (slow search in a loop)
	
	3. tDispatcher.trigger() // to execute an event. It will pass the action object to the listeners callback
		//.trigger(name) 
		//		call it with a string will execute the listener on that eventname
		//.trigger(name,value) 
		//		will pass add the value to the value-key on the action object.
		//.trigger(action) 
		//		an object that need to have an event key, as string, 
		//		describing the event to be executed and all 
		//		other values on other key names, that you want to 
		//		pass to the listener.

```
##Developer
[Tobias Nickel](http://tnickel.de/)  
![alt text](https://avatars1.githubusercontent.com/u/4189801?s=150) 