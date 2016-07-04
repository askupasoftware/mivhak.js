/**
 * Converts a string to it's actual value, if applicable
 * 
 * @param {String} str
 */
function strToValue( str )
{
    if('true' === str.toLowerCase()) return true;
    if('false' === str.toLowerCase()) return false;
    if(!isNaN(str)) return parseFloat(str);
    return str;
}

/**
 * Convert hyphened text to camelCase.
 * 
 * @param {string} str
 * @returns {string}
 */
function toCamelCase( str )
{
    return str.replace(/-(.)/g,function(match){
        return match[1].toUpperCase();
    });
}

/**
 * Reads the element's 'miv-' attributes and returns their values as an object
 * 
 * @param {DOMElement} el
 * @returns {Object}
 */
function readAttributes( el ) 
{
    var options = {};
    $.each(el.attributes, function(i, attr){
        if(/^miv-/.test(attr.name))
        {
            options[toCamelCase(attr.name.substr(4))] = strToValue(attr.value);
        }
    });
    return options;
}

/**
 * Get the average value of all elements in the given array.
 * 
 * @param {Array} arr
 * @returns {Number}
 */
function average( arr )
{
    var i = arr.length, sum = 0;
    while(i--) sum += parseFloat(arr[i]);
    return sum/arr.length;
}

/**
 * Get the maximum value of all elements in the given array.
 * 
 * @param {Array} arr
 * @returns {Number}
 */
function max( arr )
{
    var i = arr.length, maxval = arr[--i];
    while(i--) if(arr[i] > maxval) maxval = arr[i];
    return maxval;
}

/**
 * Get the minimum value of all elements in the given array.
 * 
 * @param {Array} arr
 * @returns {Number}
 */
function min( arr )
{
    var i = arr.length, minval = arr[--i];
    while(i--) if(arr[i] < minval) minval = arr[i];
    return minval;
}

/**
 * Request animation frame. Uses setTimeout as a fallback if the browser does
 * not support requestAnimationFrame (based on 60 frames per second).
 * 
 * @param {type} cb
 * @returns {Number}
 */
var raf = window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(cb) { return window.setTimeout(cb, 1000 / 60); };

/* test-code */
testapi.strToValue = strToValue;
testapi.toCamelCase = toCamelCase;
testapi.readAttributes = readAttributes;
testapi.average = average;
testapi.max = max;
testapi.min = min;
testapi.raf = raf;
/* end-test-code */