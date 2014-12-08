/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise()
{
    this.handlerGroups = [];
    this.updateCbs =[];
    this.state = 'pending';
    this.value;
}


  //its setting it as class varibales instead of on objects.
// $Promise.prototype.handlerGroups = [];
// $Promise.prototype.updateCbs = [];

$Promise.prototype.then = function (success, error, update) {

        if (typeof success !== 'function') {
          success = false;
        }

        if ( typeof error !== 'function') {
          error = false;
        };

        var already = false;

        this.handlerGroups.forEach(function(el){
          if (el.onResolve === success){
            already = true;
          }
        });

        if (!already){
          this.handlerGroups.push({onResolve: success, onReject: error});

          if ( typeof update === 'function') {
            this.updateCbs.push(update);
          };
        }

        this.handle();
}

$Promise.prototype.handle = function() {

        if (this.state === 'resolved' && this.handlerGroups.length) {
          var value = this.value;
          this.handlerGroups.forEach(function(el){
            el.onResolve(value);
          });
          //this.handlerGroups[this.handlerGroups.length-1].onResolve(this.value);
        }
}


function Deferral()
{
	this.$promise = new $Promise;
}


//Why is the constructor version unique and not this?
//Deferral.prototype.$promise = new $Promise;

Deferral.prototype.resolve = function(data)
{

	if(this.$promise.state === 'pending')
	{
		this.$promise.value = data;
		this.$promise.state = 'resolved';
    this.$promise.handle();
	}
}

Deferral.prototype.reject = function(reason)
{
	if(this.$promise.state === 'pending')
	{
		this.$promise.value = reason;
		this.$promise.state = 'rejected';
	}
}

function defer()
{
	return new Deferral();
}




/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
