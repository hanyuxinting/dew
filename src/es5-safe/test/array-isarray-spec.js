(function() {

  function assertEquals(expected, actual) {
    expect(actual).toEqual(expected);
  }

  function assertTrue(actual) {
    assertEquals(true, actual);
  }

  function assertFalse(actual) {
    assertEquals(false, actual);
  }


  // https://code.google.com/p/v8/source/browse/trunk/test/mjsunit/third_party/array-isarray.js
  describe('array-isarray', function() {

    it('Test Array.isArray', function() {

      assertTrue(Array.isArray([]));
      assertTrue(Array.isArray(new Array));
      assertTrue(Array.isArray(Array()));
      assertTrue(Array.isArray('abc'.match(/(a)*/g)));

      assertFalse((function() {
        return Array.isArray(arguments);
      })());
      assertFalse(Array.isArray());
      assertFalse(Array.isArray(null));
      assertFalse(Array.isArray(undefined));
      assertFalse(Array.isArray(true));
      assertFalse(Array.isArray(false));
      assertFalse(Array.isArray('a string'));
      assertFalse(Array.isArray({}));
      assertFalse(Array.isArray({length: 5}));
      //assertFalse(Array.isArray({__proto__: Array.prototype, length:1, 0:1, 1:2}));

    });

  });

})();
