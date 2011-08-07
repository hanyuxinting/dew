#/bin/bash

echo compress $1...

TOOLS=../seajs/support/
IN=src/$1/$1.js
OUT=build/$1/$1.js

if [ ! -d build/$1 ]
  then
    mkdir build/$1
fi
cp $IN build/$1/$1-debug.js

SIZE_MIN=$(java -jar $TOOLS/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --warning_level VERBOSE --jscomp_error checkTypes --jscomp_off fileoverviewTags --externs $TOOLS/extern.js --js $IN | tee $OUT | wc -c)
SIZE_GZIP=$(gzip -nfc --best $OUT | wc -c)

echo "$SIZE_MIN bytes minified"
echo "$SIZE_GZIP bytes gzipped"

echo ...done.