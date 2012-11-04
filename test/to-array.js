var toArray = require('to-array')
var assert = require('timoxley-assert')
var domify = require('component-domify')

describe('identifying non-collections', function() {
  it('correctly identifies JS primitives as non-collections', function () {
    assert.deepEqual([], toArray(function(){})); // functions should fail
    assert.deepEqual([], toArray(12345));
    assert.deepEqual([], toArray(null));
    assert.deepEqual([], toArray(undefined));
    assert.deepEqual([], toArray(/regexp/));
    assert.deepEqual([], toArray(new Date()));
  })

  it('detects window is not a collection', function() {
    assert.deepEqual([], toArray(window));
  })
})

describe('identifying collections', function() {
  it('correctly identifies arrays', function() {
    assert.deepEqual(['s','t','r','i','n','g'], toArray('string'));
    assert.deepEqual([1, 2], toArray([1, 2]));
    assert.deepEqual([], toArray([]));
  })

  it('correctly identifies arguments objects', function() {
    (function() {
      assert.deepEqual([1, 2], toArray(arguments), 'arguments should be arraylike'); // arguments collection
    })(1, 2)
  })

  it('won\'t grab numeric indicies if they do not exist', function() {
    var A = function() {}
    A.prototype.length = 4
    assert.deepEqual([], toArray(new A));
  })
})


describe('testing against dom', function() {
  var blink1, blink2
  before(function() {
    // pick elements that aren't likely to actually appear on the test page
    blink1 = domify('<blink class="testblink"></blink>')
    blink2 = domify('<blink class="testblink"></blink>')

    document.body.appendChild(blink1)
    document.body.appendChild(blink2)
  })

  after(function() {
    document.body.removeChild(blink1)
    document.body.removeChild(blink2)
  })

  it('fails for single nodes', function() {
    assert.deepEqual([], toArray(blink1)); // single nodes should fail
  })

  it('detects htmlelement collections are array-like', function() {
    assert.deepEqual([blink1, blink2], toArray(document.getElementsByTagName('blink')));
  })

  it('specifically identifies nodelists as a special collection', function() {
    assert.deepEqual([blink1, blink2], toArray(document.querySelectorAll('.testblink'))); // NodeList
  })
})

