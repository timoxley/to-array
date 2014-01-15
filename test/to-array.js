var toArray = require('to-array')
expect = require('expect.js')
var domify = require('component-domify')

describe('non-collections', function() {
  describe('converting into arrays', function () {
    it('single element is the function for Functions', function() {
      var func = function(){}
      expect([func]).to.eql(toArray(func));
    })
    it('single element is the number for Numbers', function() {
      expect([12345]).to.eql(toArray(12345));
    })
    it('single element is null for null', function() {
      expect([null]).to.eql(toArray(null));
    })
    it('single element is the regex for Regexps', function() {
      expect([/regexp/]).to.eql(toArray(/regexp/));
    })
    it('single element is the date for Dates', function() {
      var date = new Date()
      expect([date]).to.eql(toArray(date));
    })
    it('single element is the string for Strings', function() {
      expect(['string']).to.eql(toArray('string'));
    })
  })

  it('single element array is empty for nothing', function() {
    expect([]).to.eql(toArray());
  })
  it('detects window is not a collection', function() {
    expect([window]).to.eql(toArray(window));
  })
  it('single element is empty for undefined', function() {
    expect([]).to.eql(toArray(undefined));
  })
  it('detects `{length: true}` is not a collection', function() {
    expect([{length: true}]).to.eql(toArray({length: true}));
  })
})

describe('identifying collections', function() {
  it('correctly identifies arrays', function() {
    expect([1, 2]).to.eql(toArray([1, 2]));
    expect([]).to.eql(toArray([]));
  })

  it('correctly identifies arguments objects', function() {
    (function() {
      expect([1, 2]).to.eql(toArray(arguments), 'arguments should be arraylike'); // arguments collection
    })(1, 2)
  })
  it('correctly identifies empty arguments objects', function() {
    (function() {
      expect([]).to.eql(toArray(arguments), 'arguments should be arraylike'); // arguments collection
    })()
  })
  it.skip('won\'t grab numeric indicies if they do not exist', function() {
    var A = function() {}
    A.prototype.length = 4
    var a = new A
    expect([a]).to.eql(toArray(a));
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

  it('arrayifys single nodes', function() {
    expect([blink1]).to.eql(toArray(blink1));
  })

  it('detects htmlelement collections are array-like', function() {
    expect([blink1, blink2]).to.eql(toArray(document.getElementsByTagName('blink')));
  })

  it('detects empty collections are array-like', function() {
    expect([]).to.eql(toArray(document.getElementsByTagName('jkbsdf')));
  })
  if (document.querySelectorAll) {
    it('specifically identifies nodelists as a special collection', function() {
      expect([blink1, blink2]).to.eql(toArray(document.querySelectorAll('.testblink'))); // NodeList
    })
  }
})

