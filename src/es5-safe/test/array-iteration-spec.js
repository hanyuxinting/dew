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


  // https://code.google.com/p/v8/source/browse/trunk/test/mjsunit/array-iteration.js
  describe('array-iteration', function() {

    it('Test Array.prototype.forEach', function() {

      // Simple use.
      var a = [0,1];
      var count = 0;
      a.forEach(function() {
        count++;
      });
      assertEquals(2, count);

      // Use specified object as this object when calling the function.
      var o = { value: 42 };
      var result = [];
      a.forEach(function() {
        result.push(this.value);
      }, o);
      assertEquals([42,42], result);

      // Modify original array.
      a = [0,1];
      count = 0;
      a.forEach(function(n, index, array) {
        array[index] = n + 1;
        count++;
      });
      assertEquals(2, count);
      assertEquals([1,2], a);

      // Only loop through initial part of array even though elements are
      // added.
      a = [1,1];
      count = 0;
      a.forEach(function(n, index, array) {
        array.push(n + 1);
        count++;
      });
      assertEquals(2, count);
      assertEquals([1,1,2,2], a);

      // Respect holes.
      a = new Array(20);
      count = 0;
      a[15] = 2;
      a.forEach(function() {
        count++;
      });
      assertEquals(1, count);


      // NOTICE: native forEach will fail too. So, just obey de facto.
      /*
       Array.prototype['5'] = 1;
       var keys = [];
       a = [0,,,,,,,,,9];
       a.forEach(function(item, i) {
       keys.push(i);
       });
       assertEquals([0, 9], keys);
       delete Array.prototype['5'];
       */

    });

    it('Test Array.prototype.map', function() {

      var a = [0,1,2,3,4];

      // Simple use.
      var result = [1,2,3,4,5];
      assertEquals(result, a.map(function(n) {
        return n + 1;
      }));
      assertEquals(a, a);

      // Use specified object as this object when calling the function.
      var o = { delta: 42 };
      result = [42,43,44,45,46];
      assertEquals(result, a.map(function(n) {
        return this.delta + n;
      }, o));

      // Modify original array.
      a = [0,1,2,3,4];
      result = [2,4,6,8,10];
      assertEquals(result, a.map(function(n, index, array) {
        array[index + 1] = n + 2;
        return n + 2;
      }));
      assertEquals([0,2,4,6,8,10], a);

      // Only loop through initial part of array even though elements are
      // added.
      a = [0,1,2,3,4];
      result = [1,2,3,4,5];
      assertEquals(result, a.map(function(n, index, array) {
        array.push(n);
        return n + 1;
      }));
      assertEquals([0,1,2,3,4,0,1,2,3,4], a);

      // Respect holes.
      a = new Array(20);
      a[15] = 2;
      a = a.map(function(n) {
        return 2 * n;
      });
      assertEquals(4, a[15]);
    });

    it('Test Array.prototype.filter', function() {

      // Simple use.
      var a = [0,1];
      assertEquals([0], a.filter(function(n) {
        return n == 0;
      }));
      assertEquals(a, a);

      // Use specified object as this object when calling the function.
      var o = { value: 42 };
      a = [1,42,3,42,4];
      assertEquals([42,42], a.filter(function(n) {
        return this.value == n;
      }, o));

      // Modify original array.
      a = [1,42,3,42,4];
      assertEquals([42,42], a.filter(function(n, index, array) {
        array[index] = 43;
        return 42 == n;
      }));
      assertEquals([43,43,43,43,43], a);

      // Only loop through initial part of array even though elements are
      // added.
      a = [1,1];
      assertEquals([], a.filter(function(n, index, array) {
        array.push(n + 1);
        return n == 2;
      }));
      assertEquals([1,1,2,2], a);

      // Respect holes.
      a = new Array(20);
      var count = 0;
      a[2] = 2;
      a[15] = 2;
      a[17] = 4;
      a = a.filter(function(n) {
        count++;
        return n == 2;
      });
      assertEquals(3, count);
      assertEquals(2, a[0]);
      assertEquals(2, a[1]);

    });

    it('Test Array.prototype.every', function() {

      // Simple use.
      var a = [0,1];
      assertFalse(a.every(function(n) {
        return n == 0;
      }));
      a = [0,0];
      assertTrue(a.every(function(n) {
        return n == 0;
      }));
      assertTrue([].every(function(n) {
        return n == 0;
      }));

      // Use specified object as this object when calling the function.
      var o = { value: 42 };
      a = [0];
      assertFalse(a.every(function(n) {
        return this.value == n;
      }, o));
      a = [42];
      assertTrue(a.every(function(n) {
        return this.value == n;
      }, o));

      // Modify original array.
      a = [0,1];
      assertFalse(a.every(function(n, index, array) {
        array[index] = n + 1;
        return n == 1;
      }));
      assertEquals([1,1], a);

      // Only loop through initial part of array even though elements are
      // added.
      a = [1,1];
      assertTrue(a.every(function(n, index, array) {
        array.push(n + 1);
        return n == 1;
      }));
      assertEquals([1,1,2,2], a);

      // Respect holes.
      a = new Array(20);
      var count = 0;
      a[2] = 2;
      a[15] = 2;
      assertTrue(a.every(function(n) {
        count++;
        return n == 2;
      }));
      assertEquals(2, count);
    });

    it('Test Array.prototype.some', function() {

      var a = [0,1,2,3,4];

      // Simple use.
      assertTrue(a.some(function(n) {
        return n == 3;
      }));
      assertFalse(a.some(function(n) {
        return n == 5;
      }));

      // Use specified object as this object when calling the function.
      var o = { element: 42 };
      a = [1,42,3];
      assertTrue(a.some(function(n) {
        return this.element == n;
      }, o));
      a = [1];
      assertFalse(a.some(function(n) {
        return this.element == n;
      }, o));

      // Modify original array.
      a = [0,1,2,3];
      assertTrue(a.some(function(n, index, array) {
        array[index] = n + 1;
        return n == 2;
      }));
      assertEquals([1,2,3,3], a);

      // Only loop through initial part when elements are added.
      a = [0,1,2];
      assertFalse(a.some(function(n, index, array) {
        array.push(42);
        return n == 42;
      }));
      assertEquals([0,1,2,42,42,42], a);

      // Respect holes.
      a = new Array(20);
      var count = 0;
      a[2] = 42;
      a[10] = 2;
      a[15] = 42;
      assertTrue(a.some(function(n) {
        count++;
        return n == 2;
      }));
      assertEquals(2, count);

    });

  });

})();
