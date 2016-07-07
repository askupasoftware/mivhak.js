var Resources = function() {
    this.data = [];
};

Resources.prototype.count = function() {
    return this.data.length;
};

Resources.prototype.add = function(pre) {
    this.data.push($.extend({},
        Mivhak.resourceDefaults,{
            pre:pre, 
            content: pre.textContent
        },
        readAttributes(pre)
    ));
};

Resources.prototype.get = function(i) {
    return this.data[i];
};

Resources.prototype.update = function(i, content) {
    this.data[i].content = content;
};

