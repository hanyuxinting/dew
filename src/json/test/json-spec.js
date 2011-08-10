(function() {

  function assertEquals(expected, actual) {
    if (isNaN(expected) && isNaN(actual)) return; // assertEqual(NaN, NaN)
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

  function TestInvalid(str) {
    assertThrows(function () {
      JSON.parse(str);
    }, SyntaxError);
  }


  // https://code.google.com/p/v8/source/browse/trunk/test/mjsunit/json.js
  describe('JSON', function() {

    function DoubleNumbers(key, value) {
      return (typeof value == 'number') ? 2 * value : value;
    }


    it('Test Date.prototype.toJSON', function() {

      // Date toJSON
      assertEquals("1970-01-01T00:00:00.000Z", new Date(0).toJSON());
      assertEquals("[object JSON]", Object.prototype.toString.call(JSON));

    });


    it('Test JSON.parse', function() {

      // Parse
      assertEquals({}, JSON.parse("{}"));
      assertEquals({42:37}, JSON.parse('{"42":37}'));
      assertEquals(null, JSON.parse("null"));
      assertEquals(true, JSON.parse("true"));
      assertEquals(false, JSON.parse("false"));
      assertEquals("foo", JSON.parse('"foo"'));
      assertEquals("f\no", JSON.parse('"f\\no"'));
      assertEquals("\b\f\n\r\t\"\u2028\/\\",
          JSON.parse('"\\b\\f\\n\\r\\t\\"\\u2028\\/\\\\"'));
      assertEquals([1.1], JSON.parse("[1.1]"));
      assertEquals([1], JSON.parse("[1.0]"));

      assertEquals(0, JSON.parse("0"));
      assertEquals(1, JSON.parse("1"));
      assertEquals(0.1, JSON.parse("0.1"));
      assertEquals(1.1, JSON.parse("1.1"));
      assertEquals(1.1, JSON.parse("1.100000"));
      assertEquals(1.111111, JSON.parse("1.111111"));
      assertEquals(-0, JSON.parse("-0"));
      assertEquals(-1, JSON.parse("-1"));
      assertEquals(-0.1, JSON.parse("-0.1"));
      assertEquals(-1.1, JSON.parse("-1.1"));
      assertEquals(-1.1, JSON.parse("-1.100000"));
      assertEquals(-1.111111, JSON.parse("-1.111111"));
      assertEquals(11, JSON.parse("1.1e1"));
      assertEquals(11, JSON.parse("1.1e+1"));
      assertEquals(0.11, JSON.parse("1.1e-1"));
      assertEquals(11, JSON.parse("1.1E1"));
      assertEquals(11, JSON.parse("1.1E+1"));
      assertEquals(0.11, JSON.parse("1.1E-1"));

      assertEquals([], JSON.parse("[]"));
      assertEquals([1], JSON.parse("[1]"));
      assertEquals([1, "2", true, null], JSON.parse('[1, "2", true, null]'));

      assertEquals("", JSON.parse('""'));
      assertEquals(["", "", -0, ""], JSON.parse('[    ""  ,    ""  ,   -0,    ""]'));
      assertEquals("", JSON.parse('""'));


      function GetFilter(name) {
        function Filter(key, value) {
          return (key == name) ? undefined : value;
        }

        return Filter;
      }

      var pointJson = '{"x": 1, "y": 2}';
      assertEquals({'x': 1, 'y': 2}, JSON.parse(pointJson));
      assertEquals({'x': 1}, JSON.parse(pointJson, GetFilter('y')));
      assertEquals({'y': 2}, JSON.parse(pointJson, GetFilter('x')));
      assertEquals([1, 2, 3], JSON.parse("[1, 2, 3]"));
      assertEquals([1, undefined, 3], JSON.parse("[1, 2, 3]", GetFilter(1)));
      assertEquals([1, 2, undefined], JSON.parse("[1, 2, 3]", GetFilter(2)));


      var deepObject = '{"a": {"b": 1, "c": 2}, "d": {"e": {"f": 3}}}';
      assertEquals({"a": {"b": 1, "c": 2}, "d": {"e": {"f": 3}}},
          JSON.parse(deepObject));
      assertEquals({"a": {"b": 2, "c": 4}, "d": {"e": {"f": 6}}},
          JSON.parse(deepObject, DoubleNumbers));




      TestInvalid('abcdef');
      TestInvalid('isNaN()');
      TestInvalid('{"x": [1, 2, deepObject]}');
      TestInvalid('[1, [2, [deepObject], 3], 4]');
      TestInvalid('function () { return 0; }');

      TestInvalid("[1, 2");
      TestInvalid('{"x": 3');

      // JavaScript number literals not valid in JSON.
      TestInvalid('[01]');
      TestInvalid('[.1]');
      TestInvalid('[1.]');
      TestInvalid('[1.e1]');
      TestInvalid('[-.1]');
      TestInvalid('[-1.]');

      // Plain invalid number literals.
      TestInvalid('-');
      TestInvalid('--1');
      TestInvalid('-1e');
      TestInvalid('1e--1]');
      TestInvalid('1e+-1');
      TestInvalid('1e-+1');
      TestInvalid('1e++1');

      // JavaScript string literals not valid in JSON.
      TestInvalid("'single quote'");  // Valid JavaScript
      TestInvalid('"\\a invalid escape"');
      TestInvalid('"\\v invalid escape"');  // Valid JavaScript
      TestInvalid('"\\\' invalid escape"');  // Valid JavaScript
      TestInvalid('"\\x42 invalid escape"');  // Valid JavaScript
      TestInvalid('"\\u202 invalid escape"');
      TestInvalid('"\\012 invalid escape"');
      TestInvalid('"Unterminated string');
      TestInvalid('"Unterminated string\\"');
      TestInvalid('"Unterminated string\\\\\\"');

      // Test bad JSON that would be good JavaScript (ES5).
      TestInvalid("{true:42}");
      TestInvalid("{false:42}");
      TestInvalid("{null:42}");
      TestInvalid("{'foo':42}");
      TestInvalid("{42:42}");
      TestInvalid("{0:42}");
      TestInvalid("{-1:42}");

      // Test for trailing garbage detection.
      TestInvalid('42 px');
      TestInvalid('42 .2');
      TestInvalid('42 2');
      TestInvalid('42 e1');
      TestInvalid('"42" ""');
      TestInvalid('"42" ""');
      TestInvalid('"" ""');
      TestInvalid('true ""');
      TestInvalid('false ""');
      TestInvalid('null ""');
      TestInvalid('null ""');
      TestInvalid('[] ""');
      TestInvalid('[true] ""');
      TestInvalid('{} ""');
      TestInvalid('{"x":true} ""');
      TestInvalid('"Garbage""After string"');

    });


    it('Test JSON.stringify', function() {

      // Stringify

      assertEquals("true", JSON.stringify(true));
      assertEquals("false", JSON.stringify(false));
      assertEquals("null", JSON.stringify(null));
      assertEquals("false", JSON.stringify({toJSON: function () { return false; }}));
      assertEquals("4", JSON.stringify(4));
      assertEquals('"foo"', JSON.stringify("foo"));
      assertEquals("null", JSON.stringify(Infinity));
      assertEquals("null", JSON.stringify(-Infinity));
      assertEquals("null", JSON.stringify(NaN));
      //assertEquals("4", JSON.stringify(new Number(4)));
      assertEquals('"bar"', JSON.stringify(new String("bar")));

      assertEquals('"foo\\u0000bar"', JSON.stringify("foo\0bar"));
      assertEquals('"f\\"o\'o\\\\b\\ba\\fr\\nb\\ra\\tz"',
                   JSON.stringify("f\"o\'o\\b\ba\fr\nb\ra\tz"));

      assertEquals("[1,2,3]", JSON.stringify([1, 2, 3]));
      assertEquals("[\n 1,\n 2,\n 3\n]", JSON.stringify([1, 2, 3], null, 1));
      assertEquals("[\n  1,\n  2,\n  3\n]", JSON.stringify([1, 2, 3], null, 2));
      assertEquals("[\n  1,\n  2,\n  3\n]",
                   JSON.stringify([1, 2, 3], null, new Number(2)));
      assertEquals("[\n^1,\n^2,\n^3\n]", JSON.stringify([1, 2, 3], null, "^"));
      assertEquals("[\n^1,\n^2,\n^3\n]",
                   JSON.stringify([1, 2, 3], null, new String("^")));
      assertEquals("[\n 1,\n 2,\n [\n  3,\n  [\n   4\n  ],\n  5\n ],\n 6,\n 7\n]",
                   JSON.stringify([1, 2, [3, [4], 5], 6, 7], null, 1));
      assertEquals("[]", JSON.stringify([], null, 1));
      assertEquals("[1,2,[3,[4],5],6,7]",
                   JSON.stringify([1, 2, [3, [4], 5], 6, 7], null));
      assertEquals("[2,4,[6,[8],10],12,14]",
                   JSON.stringify([1, 2, [3, [4], 5], 6, 7], DoubleNumbers));
      assertEquals('["a","ab","abc"]', JSON.stringify(["a","ab","abc"]));

      var circular = [1, 2, 3];
      circular[2] = circular;
      assertThrows(function () { JSON.stringify(circular); }, TypeError);

      var singleton = [];
      var multiOccurrence = [singleton, singleton, singleton];
      assertEquals("[[],[],[]]", JSON.stringify(multiOccurrence));

      assertEquals('{"x":5,"y":6}', JSON.stringify({x:5,y:6}));
      assertEquals('{"x":5}', JSON.stringify({x:5,y:6}, ['x']));
      assertEquals('{\n "a": "b",\n "c": "d"\n}',
                   JSON.stringify({a:"b",c:"d"}, null, 1));
      assertEquals('{"y":6,"x":5}', JSON.stringify({x:5,y:6}, ['y', 'x']));

      // toJSON get string keys.
      var checker = {};
      var array = [checker];
      checker.toJSON = function(key) { return 1 + key; };
      assertEquals('["10"]', JSON.stringify(array));

      // The gap is capped at ten characters if specified as string.
      assertEquals('{\n          "a": "b",\n          "c": "d"\n}',
                    JSON.stringify({a:"b",c:"d"}, null,
                                   "          /*characters after 10th*/"));

      // The gap is capped at ten characters if specified as number.
      assertEquals('{\n          "a": "b",\n          "c": "d"\n}',
                    JSON.stringify({a:"b",c:"d"}, null, 15));

      // Replaced wrapped primitives are unwrapped.
      function newx(k, v)  { return (k == "x") ? new v(42) : v; }
      assertEquals('{"x":"42"}', JSON.stringify({x: String}, newx));
      assertEquals('{"x":42}', JSON.stringify({x: Number}, newx));
      assertEquals('{"x":true}', JSON.stringify({x: Boolean}, newx));

      assertEquals(undefined, JSON.stringify(undefined));
      assertEquals(undefined, JSON.stringify(function () { }));

      // Arrays with missing, undefined or function elements have those elements
      // replaced by null.
      assertEquals("[null,null,null]",
                   JSON.stringify([undefined,,function(){}]));

      // Objects with undefined or function properties (including replaced properties)
      // have those properties ignored.
      assertEquals('{}',
                   JSON.stringify({a: undefined, b: function(){}, c: 42, d: 42},
                                  function(k, v) { if (k == "c") return undefined;
                                                   if (k == "d") return function(){};
                                                   return v; }));

      TestInvalid('1); throw "foo"; (1');

      var x = 0;
      eval("(1); x++; (1)");
      TestInvalid('1); x++; (1');

      // Test string conversion of argument.
      var o = { toString: function() { return "42"; } };
      assertEquals(42, JSON.parse(o));


      for (var i = 0; i < 65536; i++) {
        var string = String.fromCharCode(i);
        var encoded = JSON.stringify(string);
        var expected = "uninitialized";
        // Following the ES5 specification of the abstraction function Quote.
        if (string == '"' || string == '\\') {
          // Step 2.a
          expected = '\\' + string;
        } else if ("\b\t\n\r\f".indexOf(string) >= 0) {
          // Step 2.b
          if (string == '\b') expected = '\\b';
          else if (string == '\t') expected = '\\t';
          else if (string == '\n') expected = '\\n';
          else if (string == '\f') expected = '\\f';
          else if (string == '\r') expected = '\\r';
        } else if (i < 32) {
          // Step 2.c
          if (i < 16) {
            expected = "\\u000" + i.toString(16);
          } else {
            expected = "\\u00" + i.toString(16);
          }
        } else {
          expected = string;
        }
        assertEquals('"' + expected + '"', encoded, "Codepoint " + i);
      }

    });

  });

})();
