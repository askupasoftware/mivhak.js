/**
 * Any <pre> element inside the mivhak wrapper is considered to be a Mivhak 
 * resource. When a new Mivhak instance is created, the list of resources is 
 * parsed nad stored in this object.
 * 
 * @returns {Resources}
 */
var Resources = function() {
    this.data = [];
};

/**
 * Return the number of resources
 * @returns {Number}
 */
Resources.prototype.count = function() {
    return this.data.length;
};

/**
 * Add a resource to the list. Given a <pre> element, this function will extract
 * all the attributes beginning with 'miv-' and the element's content and insert
 * it to the list of resources.
 * 
 * @param {DOMElement} pre
 */
Resources.prototype.add = function(pre) {
    this.data.push($.extend({},
        Mivhak.resourceDefaults,{
            pre:pre, 
            content: pre.textContent
        },
        readAttributes(pre)
    ));
};

/**
 * Get a resource by a given index
 * @param {Number} i
 * @returns {Object}
 */
Resources.prototype.get = function(i) {
    return this.data[i];
};

/**
 * Update the content of the resource corresponding to the given index.
 * 
 * @param {number} i
 * @param {string} content
 */
Resources.prototype.update = function(i, content) {
    this.data[i].content = content;
};

