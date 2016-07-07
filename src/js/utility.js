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
 * Calculate the editor's height based on the number of lines & line height.
 * 
 * @param {jQuery} $editor Ther editor wrapper element (PRE)
 * @returns {Number}
 */
function getEditorHeight( $editor )
{
    var height = 0;
    $editor.find('.ace_text-layer').children().each(function(){
        height += $(this).height();
    });
    return height;
}

/**
 * Convert a string like "3, 5-7" into an array of ranges in to form of
 * [
 *   {start:2, end:2},
 *   {start:4, end:6},
 * ]
 * The string should be given as a list if comma delimited 1 based ranges.
 * The result is given as a 0 based array of ranges.
 * 
 * @param {string} str
 * @returns {Array}
 */
function strToRange( str )
{
    var range = str.replace(' ', '').split(','),
        i = range.length,
        ranges = [],
        start, end, splitted;
    
    while(i--)
    {
        // Multiple lines highlight
        if( range[i].indexOf('-') > -1 )
        {
            splitted = range[i].split('-');
            start = parseInt(splitted[0])-1;
            end = parseInt(splitted[1])-1;
        }

        // Single line highlight
        else
        {
            start = parseInt(range[i])-1;
            end = start;
        }
        
        ranges.unshift({start:start,end:end});
    }
    
    return ranges;
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
testapi.getEditorHeight = getEditorHeight;
testapi.strToRange = strToRange;
testapi.raf = raf;
/* end-test-code */