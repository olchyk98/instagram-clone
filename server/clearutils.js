Array.prototype.removeItem = function(value) {
    this.splice(this.findIndex(io => io === value), 1);
}
