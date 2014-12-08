/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise()
{

}

$Promise.prototype.state = 'pending';
$Promise.prototype.value;

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
