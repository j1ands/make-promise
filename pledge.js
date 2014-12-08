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

        if (typeof success !== 'function') 
        {
          success = false;
        }

        if ( typeof error !== 'function') 
        {
          error = false;
        }

        var already = false;

        //refractor possibility?
        this.handlerGroups.forEach(function(el)
        {
          
          if (el.onResolve === success && el.onReject === error)
          {
            already = true;
          }

        });

        if (!already || update !== undefined)
        {
          this.handlerGroups.push({onResolve: success, onReject: error});

          if ( typeof update === 'function') 
          {
            this.updateCbs.push(update);
          }

        }

        this.handle(true);
}

$Promise.prototype.handle = function(one) {

  var handleFunc = this.handlerGroups[this.handlerGroups.length - 1];

  if(one)
  {
    if (this.state === 'resolved' && this.handlerGroups.length) 
    {
      if(handleFunc.onResolve)
      {
        handleFunc.onResolve(this.value);
        this.handlerGroups.pop();
      }
    }

    else if(this.state === 'rejected' && this.handlerGroups.length)
    {
      if(handleFunc.onReject)
      {
        handleFunc.onReject(this.value);
        this.handlerGroups.pop();
      }
    }          
  }

  else
  {
    var el = this.handlerGroups[0];
    if (this.state === 'resolved' && this.handlerGroups.length) 
    {  
      var value = this.value;
      // this.handlerGroups.forEach(function(el)
      // {
      //   if(el.onResolve)
      //   {
      //     el.onResolve(value);
      //   }
      // });

      while(this.handlerGroups.length && el.onResolve)
      {
          el = this.handlerGroups[0];
          el.onResolve(value);
          this.handlerGroups.shift();
      }
    }
    else if (this.state === 'rejected' && this.handlerGroups.length)
    {
      var value = this.value;

      while(this.handlerGroups.length && el.onReject)
      {
          el = this.handlerGroups[0];
          el.onReject(value);
          this.handlerGroups.shift();
      }    
    }
    else if(this.state === 'pending'  && this.updateCbs.length)
    {
      var value = arguments[1];

      this.updateCbs.forEach(function(ele)
      {
        ele(value);
      });
    }
  }
}

$Promise.prototype.catch = function(errorFunc)
{
  this.then(null, errorFunc);
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
    this.$promise.handle(false);
	}
}

Deferral.prototype.reject = function(reason)
{
	if(this.$promise.state === 'pending')
	{
		this.$promise.value = reason;
		this.$promise.state = 'rejected';
    this.$promise.handle(false);
	}
}

Deferral.prototype.notify = function(info)
{
  if(this.$promise.state === 'pending')
  {
    //this.$promise.value = info;
    this.$promise.handle(false, info);
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
