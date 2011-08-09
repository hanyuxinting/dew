(function() {

  var IS_NATIVE = this['IS_NATIVE'];

  function assertEquals(expected, actual) {
    expect(actual).toEqual(expected);
  }

  function assertThrows(fn, type) {
    try {
      fn();
    }
    catch(e) {
      assertEquals(type, e.constructor);
    }
  }


  // http://code.google.com/p/v8/source/browse/trunk/test/mjsunit/object-create.js
  describe('Object.create', function() {

    it('Test arguments.', function() {

      // Check that no exceptions are thrown.
      var passed = false;
      if (IS_NATIVE) {
        Object.create(null);
        Object.create(null, undefined);
        Object.create({}, {});
        passed = true;
      }
      else {
        try {
          Object.create(null);
          Object.create(null, undefined);
          Object.create({}, {});
        } catch(e) {
          passed = true;
        }
      }
      assertEquals(true, passed);


      // Check that the right exception is thrown.
      passed = false;
      try {
        Object.create(4);
        Object.create('foo');
      } catch (e) {
        passed = true;
      }
      assertEquals(true, passed);

    });

    it('Test proto.', function() {
      var ctr = 0;

      var protoFoo = { foo: function() {
        ctr++;
      }};

      // Simple object with prototype, no properties added.
      Object.create(protoFoo).foo();
      assertEquals(1, ctr);

      // Simple object with object with prototype, no properties added.
      Object.create(Object.create(protoFoo)).foo();
      assertEquals(2, ctr);
    });

  });


  // https://code.google.com/p/v8/source/browse/trunk/test/mjsunit/third_party/object-keys.js
  describe('Object.keys', function() {

    it('Test normal cases.', function() {

      assertThrows(function () { Object.keys(2) }, TypeError);
      assertThrows(function () { Object.keys('foo') }, TypeError);
      assertThrows(function () { Object.keys(null) }, TypeError);
      assertThrows(function () { Object.keys(undefined) }, TypeError);

      assertEquals(Object.keys({}), []);
      assertEquals(Object.keys({a:null}), ['a']);
      assertEquals(Object.keys({a:null, b:null}), ['a', 'b']);
      assertEquals(Object.keys({b:null, a:null}), ['b', 'a']);
      assertEquals(Object.keys([]), []);
      assertEquals(Object.keys([null]), ['0']);
      assertEquals(Object.keys([null,null]), ['0', '1']);
      assertEquals(Object.keys([null,null,,,,null]), ['0', '1', '5']);
      //assertEquals(Object.keys({__proto__:{a:null}}), []);
      //assertEquals(Object.keys({__proto__:[1,2,3]}), []);

      //var x = [];
      //x.__proto__ = [1, 2, 3];
      //assertEquals(Object.keys(x), []);
      //assertEquals(Object.keys(function () {}), []);

      assertEquals('string', typeof(Object.keys([1])[0]));

      // NOTICE: `for in` is not valid for arguments in old IE
      //function argsTest(a, b, c) {
      //  assertEquals(['0', '1', '2'], Object.keys(arguments));
      //}
      //argsTest(1, 2, 3);

      var literal = {a: 1, b: 2, c: 3};
      var keysBefore = Object.keys(literal);
      assertEquals(['a', 'b', 'c'], keysBefore);
      keysBefore[0] = 'x';
      var keysAfter = Object.keys(literal);
      assertEquals(['a', 'b', 'c'], keysAfter);
      assertEquals(['x', 'b', 'c'], keysBefore);

    });

    it('Test for DontEnum Bug.', function() {
      var DontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ];

      var o = { 'a': 1, 'b': 1, 'c': 1 };
      for(var i = 0; i < DontEnums.length; i++) {
        o[DontEnums[i]] = 1;
      }
      
      assertEquals(['a', 'b', 'c'].concat(DontEnums), Object.keys(o));
    });

  });

})();
