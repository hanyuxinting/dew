(function() {

  function assertEquals(expected, actual) {
    if (isNaN(expected) && isNaN(actual)) return; // assertEqual(NaN, NaN)
    expect(actual).toEqual(expected);
  }


  // https://code.google.com/p/v8/source/browse/trunk/test/mjsunit/date.js
  describe('Date', function() {

    it('Test Date.now', function() {

      assertEquals('function', (typeof Date));
      assertEquals('number', (typeof Date.now()));

    });

  });

})();
