'use strict';

Function.prototype.curry = function () {
  const args = Array.splice(arguments);
  
  return () => this.apply(this, args.concat(Array.splice(arguments)));
}

console.log('Function augmented');
console.log(typeof Function.prototype.curry);

