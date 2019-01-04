const oldLocaleDateString = global.Date.toLocaleDateString;
global.Date.prototype.toLocaleDateString = function() {
    console.log('ouch baby.', this.getTime());
    return toLocaleDateString.apply(this);
};