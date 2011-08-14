(function() {

  var global = this;

  function assertEquals(expected, actual) {
    expect(actual).toEqual(expected);
  }


  // http://code.google.com/p/v8/source/browse/trunk/test/mjsunit/function-bind.js
  describe('Function.prototype.bind', function() {

    function foo(x, y, z) {
      return x + y + z;
    }

    it('Simple tests.', function() {
      var f = foo.bind(foo);
      assertEquals(3, f(1, 1, 1));
      //assertEquals(3, f.length);

      f = foo.bind(foo, 2);
      assertEquals(4, f(1, 1));
      //assertEquals(2, f.length);

      f = foo.bind(foo, 2, 2);
      assertEquals(5, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo, 2, 2, 2);
      assertEquals(6, f());
      //assertEquals(0, f.length);
    });

    it('Test that length works correctly even if more than the actual number of arguments are given when binding.', function() {
      var f = foo.bind(foo, 1, 2, 3, 4, 5, 6, 7, 8, 9);
      assertEquals(6, f());
      assertEquals(0, f.length);
    });

    it('Use a different bound object.', function() {
      var obj = {x: 42, y: 43};

      // Values that would normally be in "this" when calling f_bound_this.
      global.x = 42;
      global.y = 44;

      function f_bound_this(z) {
        return z + this.y - this.x;
      }

      assertEquals(3, f_bound_this(1));

      var f = f_bound_this.bind(obj);
      assertEquals(2, f(1));
      //assertEquals(1, f.length);

      f = f_bound_this.bind(obj, 2);
      assertEquals(3, f());
      assertEquals(0, f.length);
    });

    it('Test chained binds.', function() {
      // When only giving the thisArg, any number of binds should have
      // the same effect.
      var f = foo.bind(foo);
      assertEquals(3, f(1, 1, 1));
      f = foo.bind(foo).bind(foo).bind(foo).bind(foo);
      assertEquals(3, f(1, 1, 1));
      //assertEquals(3, f.length);

      // Giving bound parameters should work at any place in the chain.
      f = foo.bind(foo, 1).bind(foo).bind(foo).bind(foo);
      assertEquals(3, f(1, 1));
      //assertEquals(2, f.length);

      f = foo.bind(foo).bind(foo, 1).bind(foo).bind(foo);
      assertEquals(3, f(1, 1));
      //assertEquals(2, f.length);

      f = foo.bind(foo).bind(foo).bind(foo, 1).bind(foo);
      assertEquals(3, f(1, 1));
      //assertEquals(2, f.length);

      f = foo.bind(foo).bind(foo).bind(foo).bind(foo, 1);
      assertEquals(3, f(1, 1));
      //assertEquals(2, f.length);

      // Several parameters can be given, and given in different bind invokations.
      f = foo.bind(foo, 1, 1).bind(foo).bind(foo).bind(foo);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo).bind(foo, 1, 1).bind(foo).bind(foo);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo).bind(foo, 1, 1).bind(foo).bind(foo);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo).bind(foo).bind(foo, 1, 1).bind(foo);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo).bind(foo).bind(foo).bind(foo, 1, 1);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo, 1).bind(foo, 1).bind(foo).bind(foo);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo, 1).bind(foo).bind(foo, 1).bind(foo);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo, 1).bind(foo).bind(foo).bind(foo, 1);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);

      f = foo.bind(foo).bind(foo, 1).bind(foo).bind(foo, 1);
      assertEquals(3, f(1));
      //assertEquals(1, f.length);
    });

    function bar(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    it('Test constructor calls.', function() {
      var f = bar.bind(bar);

      var obj2 = new f(1, 2, 3);
      assertEquals(1, obj2.x);
      assertEquals(2, obj2.y);
      assertEquals(3, obj2.z);

      f = bar.bind(bar, 1);
      obj2 = new f(2, 3);
      assertEquals(1, obj2.x);
      assertEquals(2, obj2.y);
      assertEquals(3, obj2.z);

      f = bar.bind(bar, 1, 2);
      obj2 = new f(3);
      assertEquals(1, obj2.x);
      assertEquals(2, obj2.y);
      assertEquals(3, obj2.z);

      f = bar.bind(bar, 1, 2, 3);
      obj2 = new f();
      assertEquals(1, obj2.x);
      assertEquals(2, obj2.y);
      assertEquals(3, obj2.z);
    });

    it('Test bind chains when used as a constructor.', function() {
      var f = bar.bind(bar, 1).bind(bar, 2).bind(bar, 3);

      var obj2 = new f();
      assertEquals(1, obj2.x);
      assertEquals(2, obj2.y);
      assertEquals(3, obj2.z);

      // Test instanceof obj2 is bar, not f.
      assertEquals(true, obj2 instanceof bar);
      assertEquals(false, obj2 instanceof f); // NOTICE: fail

    });

    it('Test that bind is called on non-callable objects.', function() {
      var o = { bind: Function.prototype.bind };

      var passed = false;
      try {
        o.bind();
      } catch(e) {
        passed = true;
      }

      assertEquals(true, passed);

    });

    it('Test issue #18', function() {
      // https://github.com/seajs/dew/issues/18

      // case 1
      function Foo(name) {
        return [this.name = name, 1, 2, 3];
      }
      assertEquals(['instance', 1, 2, 3], new Foo('instance'));

      var F = Foo.bind({ 'name': 'bound' });
      assertEquals(['other', 1, 2, 3], new F('other'));


      // case 2
      function bar(a, b, c) {
        assertEquals(['a', 'b', 'c', 'd', 'e', 'f'], [].slice.call(arguments));
        assertEquals('bound', this.name);
      }

      var b = bar.bind({ 'name': 'bound' }, 'a', 'b', 'c');
      b.call({ 'name': 'ignored' }, 'd', 'e', 'f');
      b.apply({ 'name': 'ignored' }, ['d', 'e', 'f']);


      // case 3
      function Foo2() {
        return this;
      }
      Foo2.prototype.name = 'default';
      
      var F2 = Foo2.bind({ 'name': 'bound' });
      assertEquals('bound', F2.call(new F2).name); // NOTICE: fail

    });

  });

})();
