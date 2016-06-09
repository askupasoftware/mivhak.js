QUnit.test( "strToValue", function( assert ) {
    assert.equal( testapi.strToValue('true'), true );
    assert.equal( testapi.strToValue('false'), false );
    assert.equal( testapi.strToValue('31'), 31 );
    assert.equal( testapi.strToValue('5.5'), 5.5 );
    assert.equal( testapi.strToValue('hello'), 'hello' );
});

QUnit.test( "toCamelCase", function( assert ) {
    assert.equal( testapi.toCamelCase('my-camel-case'), 'myCamelCase' );
    assert.equal( testapi.toCamelCase('my-Camel-Case'), 'myCamelCase' );
    assert.notEqual( testapi.toCamelCase('my-'), 'my' );
});

QUnit.test( "readAttributes", function( assert ) {
    assert.deepEqual( testapi.mivhak.readAttributes($('<div miv-attr="value" miv-attr-two="value">')[0]), {
        attr: "value",
        attrTwo: "value"
    });
    assert.deepEqual( testapi.mivhak.readAttributes($('<div miv-bool="true" miv-number="14">')[0]), {
        bool: true,
        number: 14
    });
});

QUnit.test( "setOptions", function( assert ) {
    var options = $.extend(true, {}, testapi.mivhak.defaults);
    options.lineNumbers = true;
    options.ace.theme = 'clouds';
    $('.mivhak').mivhak(options);
    assert.equal( testapi.mivhak.defaults.lineNumbers, false);
    assert.equal( $('.mivhak').data('mivhak').options.lineNumbers, true);
    assert.equal( $('.mivhak').data('mivhak').options.ace.theme, 'clouds');
});