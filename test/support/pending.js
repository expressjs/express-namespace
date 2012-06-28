
module.exports = function(n, fn){
  return function(err){
    if (err) return fn(err);
    --n || fn();
  }
};