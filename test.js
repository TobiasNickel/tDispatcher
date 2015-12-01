var TDispatcher = require('./tDispatcher.js');
var assert = require('assert');

assert(TDispatcher, 'module was not loading');
var dispatcher = new TDispatcher();

var c = 0;
dispatcher.on('test',function(){
  c++;
});
dispatcher.trigger('test')

assert(c, "the test has not executed");


/***********************************************************/
dispatcher.on({
  event:'test2',
  require:['store2'],
  name:'store1',
  callback:function(action){
    assert(action.value=='b','value has not been passed');
    assert(c===2,'store2 was not executed before store1');
    c++;
  }
});
dispatcher.on({
  event:'test2',
  name:'store2',
  callback:function(action){
    assert(action.value=='b','value has not been passed');
    assert(c===1,'store 2 is running first');
    c++;
  }
});

dispatcher.trigger({event:'test2',value:'b'});

assert(c===3, 'not all dispatcher have been executed')


/***********************************************************/

dispatcher.on('dispatched',function(){});
var s1handler = function(action){
  assert(action.value=='b','value has not been passed');
  assert(c===4,'store2 was not executed before store1');
  c++;
};
dispatcher.on({
  event:'test3',
  name:'store1',
  require:['store2'],
  callback:s1handler
});

dispatcher.on({
  event: 'test3',
  name: 'store2',
  callback: function(action){
    dispatcher.trigger({event: 'test3.2', value: 'b'});
    assert(action.value == 'b', 'value has not been passed');
    assert(c===3, 'store 2 is running first');
    c++;
  }
});

dispatcher.on({
  event: 'test3',
  name: 'store3',
  callback: function(action){
    assert(c===5, 'this test is not running the last');
  }
});

dispatcher.addAction('test3')
dispatcher.test3('b');

dispatcher.off('test3','store2'); // remove one listener by name
dispatcher.off('test3',s1handler); // remove one listener by its handler
dispatcher.off('test3'); // remove all listener from test3
dispatcher.off(); // remove all listener

console.log('done');
