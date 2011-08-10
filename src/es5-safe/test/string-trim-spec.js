(function() {

  function assertEquals(expected, actual) {
    if (isNaN(expected) && isNaN(actual)) return; // assertEqual(NaN, NaN)
    expect(actual).toEqual(expected);
  }


  // https://code.google.com/p/v8/source/browse/trunk/test/mjsunit/third_party/string-trim.js
  describe('string-trim', function() {

    var trim = String.prototype.trim;

    var testString = 'foo bar';
    var trimString = '';
    var leftTrimString = '';
    var rightTrimString = '';
    var wsString = '';

    var whitespace = [
      {s : '\u0009', t : 'HORIZONTAL TAB'},
      {s : '\u000A', t : 'LINE FEED OR NEW LINE'},
      {s : '\u000B', t : 'VERTICAL TAB'},
      {s : '\u000C', t : 'FORMFEED'},
      {s : '\u000D', t : 'CARRIAGE RETURN'},
      {s : '\u0020', t : 'SPACE'},
      {s : '\u00A0', t : 'NO-BREAK SPACE'},
      {s : '\u2000', t : 'EN QUAD'},
      {s : '\u2001', t : 'EM QUAD'},
      {s : '\u2002', t : 'EN SPACE'},
      {s : '\u2003', t : 'EM SPACE'},
      {s : '\u2004', t : 'THREE-PER-EM SPACE'},
      {s : '\u2005', t : 'FOUR-PER-EM SPACE'},
      {s : '\u2006', t : 'SIX-PER-EM SPACE'},
      {s : '\u2007', t : 'FIGURE SPACE'},
      {s : '\u2008', t : 'PUNCTUATION SPACE'},
      {s : '\u2009', t : 'THIN SPACE'},
      {s : '\u200A', t : 'HAIR SPACE'},
      {s : '\u3000', t : 'IDEOGRAPHIC SPACE'},
      {s : '\u2028', t : 'LINE SEPARATOR'},
      {s : '\u2029', t : 'PARAGRAPH SEPARATOR'},
      {s : '\u200B', t : 'ZERO WIDTH SPACE (category Cf)'}
    ];

    
    it('Test String.prototype.trim', function() {

      for (var i = 0; i < whitespace.length; i++) {
        assertEquals(whitespace[i].s.trim(), '');
        wsString += whitespace[i].s;
      }

      trimString = wsString + testString + wsString;
      leftTrimString = testString + wsString;  // Trimmed from the left.
      rightTrimString = wsString + testString;  // Trimmed from the right.

      assertEquals(wsString.trim(), '');
      assertEquals(trimString.trim(), testString);
      assertEquals(leftTrimString.trim(), testString);
      assertEquals(rightTrimString.trim(), testString);

      var testValues = [0, Infinity, NaN, true, false, ({}), ['an','array'],
        ({toString:function() {
          return 'wibble'
        }})
      ];

      for (i = 0; i < testValues.length; i++) {
        assertEquals(trim.call(testValues[i]), String(testValues[i]));
      }

    });

  });

})();
