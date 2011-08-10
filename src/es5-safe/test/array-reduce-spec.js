(function() {

  function assertEquals(expected, actual) {
    if(isNaN(expected) && isNaN(actual)) return; // assertEqual(NaN, NaN)
    expect(actual).toEqual(expected);
  }

  function assertTrue(actual) {
    assertEquals(true, actual);
  }


  // https://code.google.com/p/v8/source/browse/trunk/test/mjsunit/array-reduce.js
  describe('array-reduce', function() {

    function clone(v) {
      // Shallow-copies arrays, returns everything else verbatim.
      if (v instanceof Array) {
        // Shallow-copy an array.
        var newArray = new Array(v.length);
        for (var i in v) {
          if (v.hasOwnProperty(i)) {
            newArray[i] = v[i];
          }
        }
        return newArray;
      }
      return v;
    }


    // Creates a callback function for reduce/reduceRight that tests the number
    // of arguments and otherwise behaves as "func", but which also
    // records all calls in an array on the function (as arrays of arguments
    // followed by result).
    function makeRecorder(func) {
      var record = [];

      var f = function(a, b, i, s) {
        assertEquals(4, arguments.length);
        assertEquals("number", typeof(i));
        assertEquals(s[i], b);

        if (record.length > 0) {
          var prevRecord = record[record.length - 1];
          var prevResult = prevRecord[prevRecord.length - 1];
          assertEquals(prevResult, a);
        }

        var args = [clone(a), clone(b), i, clone(s)];
        var result = func.apply(this, arguments);
        args.push(clone(result));
        record.push(args);

        return result;
      };

      f.record = record;
      return f;
    }


    function testReduce(type, testName, expectedResult, expectedCalls, array, combine, init) {
      var rec = makeRecorder(combine);
      var result = arguments.length > 6 ? array[type](rec, init) : array[type](rec);
      var calls = rec.record;

      assertEquals(expectedCalls.length, calls.length);

      for (var i = 0; i < expectedCalls.length; i++) {
        assertEquals(expectedCalls[i], calls[i]);
      }

      assertEquals(expectedResult, result);
    }


    function sum(a, b) {
      return a + b;
    }

    function prod(a, b) {
      return a * b;
    }

    function dec(a, b, i, arr) {
      return a + b * Math.pow(10, arr.length - i - 1);
    }

    function accumulate(acc, elem, i) {
      acc[i] = elem;
      return acc;
    }

    var simpleArray = [2,4,6];

    var simpleSparseArray = [,,,2,,4,,6];

    var verySparseArray = [];
    verySparseArray.length = 10000;
    verySparseArray[2000] = 2;
    verySparseArray[5000] = 4;
    verySparseArray[9000] = 6;

    var verySparseSlice2 = verySparseArray.slice(0, 2001);
    var verySparseSlice4 = verySparseArray.slice(0, 5001);
    var verySparseSlice6 = verySparseArray.slice(0, 9001);

    var verySparseSuffix6 = [];
    verySparseSuffix6[9000] = 6;
    var verySparseSuffix4 = [];
    verySparseSuffix4[5000] = 4;
    verySparseSuffix4[9000] = 6;
    var verySparseSuffix2 = verySparseSlice6;


    it('Test Array.prototype.reduce', function() {

      testReduce("reduce", "SimpleReduceSum", 12,
           [
             [0, 2, 0, simpleArray, 2],
             [2, 4, 1, simpleArray, 6],
             [6, 6, 2, simpleArray, 12]
           ],
           simpleArray, sum, 0);

      testReduce("reduce", "SimpleReduceProd", 48,
           [
             [1, 2, 0, simpleArray, 2],
             [2, 4, 1, simpleArray, 8],
             [8, 6, 2, simpleArray, 48]
           ],
           simpleArray, prod, 1);

      testReduce("reduce", "SimpleReduceDec", 246,
           [
             [0, 2, 0, simpleArray, 200],
             [200, 4, 1, simpleArray, 240],
             [240, 6, 2, simpleArray, 246]
           ],
           simpleArray, dec, 0);

      testReduce("reduce", "SimpleReduceAccumulate", simpleArray,
          [
              [[], 2, 0, simpleArray, [2]],
              [[2], 4, 1, simpleArray, [2, 4]],
              [[2, 4], 6, 2, simpleArray, [2, 4, 6]]
          ],
          simpleArray, accumulate, []);


      testReduce("reduce", "EmptyReduceSum", 0, [], [], sum, 0);
      testReduce("reduce", "EmptyReduceProd", 1, [], [], prod, 1);
      testReduce("reduce", "EmptyReduceDec", 0, [], [], dec, 0);
      testReduce("reduce", "EmptyReduceAccumulate", [], [], [], accumulate, []);

      testReduce("reduce", "EmptyReduceSumNoInit", 0, [], [0], sum);
      testReduce("reduce", "EmptyReduceProdNoInit", 1, [], [1], prod);
      testReduce("reduce", "EmptyReduceDecNoInit", 0, [], [0], dec);
      testReduce("reduce", "EmptyReduceAccumulateNoInit", [], [], [[]], accumulate);

      
      testReduce("reduce", "SimpleSparseReduceSum", 12,
           [
             [0, 2, 3, simpleSparseArray, 2],
             [2, 4, 5, simpleSparseArray, 6],
             [6, 6, 7, simpleSparseArray, 12]
           ],
           simpleSparseArray, sum, 0);

      testReduce("reduce", "SimpleSparseReduceProd", 48,
           [[1, 2, 3, simpleSparseArray, 2],
            [2, 4, 5, simpleSparseArray, 8],
            [8, 6, 7, simpleSparseArray, 48]],
           simpleSparseArray, prod, 1);

      testReduce("reduce", "SimpleSparseReduceDec", 20406,
           [[0, 2, 3, simpleSparseArray, 20000],
            [20000, 4, 5, simpleSparseArray, 20400],
            [20400, 6, 7, simpleSparseArray, 20406]],
           simpleSparseArray, dec, 0);

      testReduce("reduce", "SimpleSparseReduceAccumulate", [,,,2,,4,,6],
           [[[], 2, 3, simpleSparseArray, [,,,2]],
            [[,,,2], 4, 5, simpleSparseArray, [,,,2,,4]],
            [[,,,2,,4], 6, 7, simpleSparseArray, [,,,2,,4,,6]]],
           simpleSparseArray, accumulate, []);


      testReduce("reduce", "EmptySparseReduceSumNoInit", 0, [], [,,0], sum);
      testReduce("reduce", "EmptySparseReduceProdNoInit", 1, [], [,,1], prod);
      testReduce("reduce", "EmptySparseReduceDecNoInit", 0, [], [,,0], dec);
      testReduce("reduce", "EmptySparseReduceAccumulateNoInit", [], [], [,,[]], accumulate);


      testReduce("reduce", "VerySparseReduceSum", 12,
           [[0, 2, 2000, verySparseArray, 2],
            [2, 4, 5000, verySparseArray, 6],
            [6, 6, 9000, verySparseArray, 12]],
           verySparseArray, sum, 0);

      testReduce("reduce", "VerySparseReduceProd", 48,
           [[1, 2, 2000, verySparseArray, 2],
            [2, 4, 5000, verySparseArray, 8],
            [8, 6, 9000, verySparseArray, 48]],
           verySparseArray, prod, 1);

      testReduce("reduce", "VerySparseReduceDec", Infinity,
           [[0, 2, 2000, verySparseArray, Infinity],
            [Infinity, 4, 5000, verySparseArray, Infinity],
            [Infinity, 6, 9000, verySparseArray, Infinity]],
           verySparseArray, dec, 0);

      testReduce("reduce", "VerySparseReduceAccumulate",
           verySparseSlice6,
           [[[], 2, 2000, verySparseArray, verySparseSlice2],
            [verySparseSlice2, 4, 5000, verySparseArray, verySparseSlice4],
            [verySparseSlice4, 6, 9000, verySparseArray, verySparseSlice6]],
           verySparseArray, accumulate, []);


      testReduce("reduce", "VerySparseReduceSumNoInit", 12,
           [[2, 4, 5000, verySparseArray, 6],
            [6, 6, 9000, verySparseArray, 12]],
           verySparseArray, sum);

      testReduce("reduce", "VerySparseReduceProdNoInit", 48,
           [[2, 4, 5000, verySparseArray, 8],
            [8, 6, 9000, verySparseArray, 48]],
           verySparseArray, prod);

      testReduce("reduce", "VerySparseReduceDecNoInit", Infinity,
           [[2, 4, 5000, verySparseArray, Infinity],
            [Infinity, 6, 9000, verySparseArray, Infinity]],
           verySparseArray, dec);

      testReduce("reduce", "SimpleSparseReduceAccumulateNoInit",
           2,
           [[2, 4, 5000, verySparseArray, 2],
            [2, 6, 9000, verySparseArray, 2]],
           verySparseArray, accumulate);

    });

    
    it('Test Array.prototype.reduceRight', function() {

      testReduce("reduceRight", "SimpleReduceRightSum", 12,
           [[0, 6, 2, simpleArray, 6],
            [6, 4, 1, simpleArray, 10],
            [10, 2, 0, simpleArray, 12]],
           simpleArray, sum, 0);

      testReduce("reduceRight", "SimpleReduceRightProd", 48,
           [[1, 6, 2, simpleArray, 6],
            [6, 4, 1, simpleArray, 24],
            [24, 2, 0, simpleArray, 48]],
           simpleArray, prod, 1);

      testReduce("reduceRight", "SimpleReduceRightDec", 246,
           [[0, 6, 2, simpleArray, 6],
            [6, 4, 1, simpleArray, 46],
            [46, 2, 0, simpleArray, 246]],
           simpleArray, dec, 0);

      testReduce("reduceRight", "SimpleReduceRightAccumulate", simpleArray,
           [[[], 6, 2, simpleArray, [,,6]],
            [[,,6], 4, 1, simpleArray, [,4,6]],
            [[,4,6], 2, 0, simpleArray, simpleArray]],
           simpleArray, accumulate, []);


      testReduce("reduceRight", "EmptyReduceRightSum", 0, [], [], sum, 0);
      testReduce("reduceRight", "EmptyReduceRightProd", 1, [], [], prod, 1);
      testReduce("reduceRight", "EmptyReduceRightDec", 0, [], [], dec, 0);
      testReduce("reduceRight", "EmptyReduceRightAccumulate", [],
                 [], [], accumulate, []);

      testReduce("reduceRight", "EmptyReduceRightSumNoInit", 0, [], [0], sum);
      testReduce("reduceRight", "EmptyReduceRightProdNoInit", 1, [], [1], prod);
      testReduce("reduceRight", "EmptyReduceRightDecNoInit", 0, [], [0], dec);
      testReduce("reduceRight", "EmptyReduceRightAccumulateNoInit",
                 [], [], [[]], accumulate);


      testReduce("reduceRight", "SimpleSparseReduceRightSum", 12,
           [[0, 6, 7, simpleSparseArray, 6],
            [6, 4, 5, simpleSparseArray, 10],
            [10, 2, 3, simpleSparseArray, 12]],
           simpleSparseArray, sum, 0);

      testReduce("reduceRight", "SimpleSparseReduceRightProd", 48,
           [[1, 6, 7, simpleSparseArray, 6],
            [6, 4, 5, simpleSparseArray, 24],
            [24, 2, 3, simpleSparseArray, 48]],
           simpleSparseArray, prod, 1);

      testReduce("reduceRight", "SimpleSparseReduceRightDec", 20406,
           [[0, 6, 7, simpleSparseArray, 6],
            [6, 4, 5, simpleSparseArray, 406],
            [406, 2, 3, simpleSparseArray, 20406]],
           simpleSparseArray, dec, 0);

      testReduce("reduceRight", "SimpleSparseReduceRightAccumulate", [,,,2,,4,,6],
           [[[], 6, 7, simpleSparseArray, [,,,,,,,6]],
            [[,,,,,,,6], 4, 5, simpleSparseArray, [,,,,,4,,6]],
            [[,,,,,4,,6], 2, 3, simpleSparseArray, [,,,2,,4,,6]]],
           simpleSparseArray, accumulate, []);


      testReduce("reduceRight", "EmptySparseReduceRightSumNoInit",
           0, [], [,,0], sum);
      testReduce("reduceRight", "EmptySparseReduceRightProdNoInit",
           1, [], [,,1], prod);
      testReduce("reduceRight", "EmptySparseReduceRightDecNoInit",
           0, [], [,,0], dec);
      testReduce("reduceRight", "EmptySparseReduceRightAccumulateNoInit",
           [], [], [,,[]], accumulate);


      testReduce("reduceRight", "VerySparseReduceRightSum", 12,
           [[0, 6, 9000, verySparseArray, 6],
            [6, 4, 5000, verySparseArray, 10],
            [10, 2, 2000, verySparseArray, 12]],
           verySparseArray, sum, 0);

      testReduce("reduceRight", "VerySparseReduceRightProd", 48,
           [[1, 6, 9000, verySparseArray, 6],
            [6, 4, 5000, verySparseArray, 24],
            [24, 2, 2000, verySparseArray, 48]],
           verySparseArray, prod, 1);

      testReduce("reduceRight", "VerySparseReduceRightDec", Infinity,
           [[0, 6, 9000, verySparseArray, Infinity],
            [Infinity, 4, 5000, verySparseArray, Infinity],
            [Infinity, 2, 2000, verySparseArray, Infinity]],
           verySparseArray, dec, 0);

      testReduce("reduceRight", "VerySparseReduceRightAccumulate",
           verySparseSuffix2,
           [[[], 6, 9000, verySparseArray, verySparseSuffix6],
            [verySparseSuffix6, 4, 5000, verySparseArray, verySparseSuffix4],
            [verySparseSuffix4, 2, 2000, verySparseArray, verySparseSuffix2]],
           verySparseArray, accumulate, []);


      testReduce("reduceRight", "VerySparseReduceRightSumNoInit", 12,
           [[6, 4, 5000, verySparseArray, 10],
            [10, 2, 2000, verySparseArray, 12]],
           verySparseArray, sum);

      testReduce("reduceRight", "VerySparseReduceRightProdNoInit", 48,
           [[6, 4, 5000, verySparseArray, 24],
            [24, 2, 2000, verySparseArray, 48]],
           verySparseArray, prod);

      testReduce("reduceRight", "VerySparseReduceRightDecNoInit", Infinity,
           [[6, 4, 5000, verySparseArray, Infinity],
            [Infinity, 2, 2000, verySparseArray, Infinity]],
           verySparseArray, dec);

      testReduce("reduceRight", "SimpleSparseReduceRightAccumulateNoInit",
           6,
           [[6, 4, 5000, verySparseArray, 6],
            [6, 2, 2000, verySparseArray, 6]],
           verySparseArray, accumulate);
      
    });

    it('Test edge cases.', function() {

      // undefined is an element
      var undefArray = [,,undefined,,undefined];

      testReduce("reduce", "SparseUndefinedReduceAdd", NaN,
           [[0, undefined, 2, undefArray, NaN],
            [NaN, undefined, 4, undefArray, NaN]
           ],
           undefArray, sum, 0);

      testReduce("reduceRight", "SparseUndefinedReduceRightAdd", NaN,
           [[0, undefined, 4, undefArray, NaN],
            [NaN, undefined, 2, undefArray, NaN]
           ], undefArray, sum, 0);

      testReduce("reduce", "SparseUndefinedReduceAddNoInit", NaN,
           [[undefined, undefined, 4, undefArray, NaN]
           ], undefArray, sum);

      testReduce("reduceRight", "SparseUndefinedReduceRightAddNoInit", NaN,
           [[undefined, undefined, 2, undefArray, NaN]
           ], undefArray, sum);


      // Ignore non-array properties:
      var arrayPlus = [1,2,,3];
      arrayPlus[-1] = NaN;
      arrayPlus[Math.pow(2,32)] = NaN;
      arrayPlus[NaN] = NaN;
      arrayPlus["00"] = NaN;
      arrayPlus["02"] = NaN;
      arrayPlus["-0"] = NaN;

      testReduce("reduce", "ArrayWithNonElementPropertiesReduce", 6,
           [[0, 1, 0, arrayPlus, 1],
            [1, 2, 1, arrayPlus, 3],
            [3, 3, 3, arrayPlus, 6]
           ], arrayPlus, sum, 0);

      testReduce("reduceRight", "ArrayWithNonElementPropertiesReduceRight", 6,
           [[0, 3, 3, arrayPlus, 3],
            [3, 2, 1, arrayPlus, 5],
            [5, 1, 0, arrayPlus, 6]
           ], arrayPlus, sum, 0);


      // Test error conditions:
      var exception = false;
      try {
        [1].reduce("not a function");
      } catch (e) {
        exception = true;
        assertTrue(e instanceof TypeError);
        assertEquals("called_non_callable", e.type,
                     "reduce non function TypeError type");
      }
      assertTrue(exception);

      exception = false;
      try {
        [1].reduceRight("not a function");
      } catch (e) {
        exception = true;
        assertTrue(e instanceof TypeError,
                   "reduceRight callback not a function not throwing TypeError");
        assertEquals("called_non_callable", e.type,
                     "reduceRight non function TypeError type");
      }
      assertTrue(exception);

      exception = false;
      try {
        [].reduce(sum);
      } catch (e) {
        exception = true;
        assertTrue(e instanceof TypeError,
                   "reduce no initial value not throwing TypeError");
        assertEquals("reduce_no_initial", e.type,
                     "reduce no initial TypeError type");
      }
      assertTrue(exception);

      exception = false;
      try {
        [].reduceRight(sum);
      } catch (e) {
        exception = true;
        assertTrue(e instanceof TypeError,
                   "reduceRight no initial value not throwing TypeError");
        assertEquals("reduce_no_initial", e.type,
                     "reduceRight no initial TypeError type");
      }
      assertTrue(exception);

      exception = false;
      try {
        [].reduce(sum);
      } catch (e) {
        exception = true;
        assertTrue(e instanceof TypeError,
                   "reduce sparse no initial value not throwing TypeError");
        assertEquals("reduce_no_initial", e.type,
                     "reduce no initial TypeError type");
      }
      assertTrue(exception);

      exception = false;
      try {
        [].reduceRight(sum);
      } catch (e) {
        exception = true;
        assertTrue(e instanceof TypeError,
                   "reduceRight sparse no initial value not throwing TypeError");
      }
      assertTrue(exception);


      // Array changing length
      function manipulator(a, b, i, s) {
        if (s.length % 2) {
          s[s.length * 3] = i;
        } else {
          s.length = s.length >> 1;
        }
        return a + b;
      }

      var arr = [1, 2, 3, 4];
      testReduce("reduce", "ArrayManipulationShort", 3,
                 [[0, 1, 0, [1, 2, 3, 4], 1],
                  [1, 2, 1, [1, 2], 3]
                 ], arr, manipulator, 0);

      arr = [1, 2, 3, 4, 5];
      testReduce("reduce", "ArrayManipulationLonger", 10,
                 [[0, 1, 0, [1, 2, 3, 4, 5], 1],
                  [1, 2, 1, [1, 2, 3, 4, 5,,,,,,,,,,, 0], 3],
                  [3, 3, 2, [1, 2, 3, 4, 5], 6],
                  [6, 4, 3, [1, 2, 3, 4], 10]
                 ], arr, manipulator, 0);

      function extender(a, b, i, s) {
        s[s.length] = s.length;
        return a + b;
      }

      arr = [1, 2, 3, 4];
      testReduce("reduce", "ArrayManipulationExtender", 10,
                 [[0, 1, 0, [1, 2, 3, 4], 1],
                  [1, 2, 1, [1, 2, 3, 4, 4], 3],
                  [3, 3, 2, [1, 2, 3, 4, 4, 5], 6],
                  [6, 4, 3, [1, 2, 3, 4, 4, 5, 6], 10]
                 ], arr, extender, 0);

    });

  });

})();
