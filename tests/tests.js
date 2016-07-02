QUnit.module( "Utility" );

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
    assert.deepEqual( testapi.readAttributes($('<div miv-attr="value" miv-attr-two="value">')[0]), {
        attr: "value",
        attrTwo: "value"
    });
    assert.deepEqual( testapi.readAttributes($('<div miv-bool="true" miv-number="14">')[0]), {
        bool: true,
        number: 14
    });
});

QUnit.test( "average", function( assert ) {
    assert.equal( testapi.average([2,4,6]), 4 );
    assert.equal( testapi.average([1.5,7.5,3]),  4);
    assert.equal( testapi.average(['1.5',7.5,3]),  4);
});

QUnit.test( "min", function( assert ) {
    assert.equal( testapi.min([2,4,6]), 2 );
    assert.equal( testapi.min([1.5,7.5,3]),  1.5);
    assert.equal( testapi.min([-3,2,3]),  -3);
});

QUnit.test( "max", function( assert ) {
    assert.equal( testapi.max([2,4,6]), 6 );
    assert.equal( testapi.max([1.5,7.5,3]),  7.5);
    assert.equal( testapi.max([-1.5,7.5,9]),  9);
});

QUnit.module( "Core" );

QUnit.test( "setOptions", function( assert ) {
    var options = $.extend(true, {}, testapi.mivhak.defaults);
    options.collapsed = true;
    $('#set-options-test').mivhak(options);
    assert.equal( testapi.mivhak.defaults.collapsed, false);
    assert.equal( $('#set-options-test').data('mivhak').options.collapsed, true);
    assert.equal( $('#set-options-test').hasClass('mivhak-collapsed'), true);
});

QUnit.test( "updateOptions", function( assert ) {
    $('#set-options-test').mivhak({collapsed:false});
    assert.equal( $('#set-options-test').data('mivhak').options.collapsed, false);
    assert.equal( $('#set-options-test').hasClass('mivhak-collapsed'), false);
});

QUnit.test( "setHeight", function( assert ) {
    $('#set-options-test').mivhak();
    console.log($('#set-height-test').height());
    console.log($('#set-height-test').data('mivhak'));
    assert.expect(0);
});