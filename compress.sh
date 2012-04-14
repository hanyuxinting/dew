#/bin/bash
#usage: ./compress.sh name

echo compress $1...

TOOLS=../seajs/tools/
IN=src/$1/$1.js
OUT=build/$1/$1.js

if [ ! -d dist/$1 ]
  then
    mkdir dist/$1
fi
cp $IN dist/$1/$1-debug.js

SIZE_SRC=$(cat $IN | wc -c)
SIZE_MIN=$(java -jar $TOOLS/compiler.jar --js $IN | tee $OUT | wc -c)
SIZE_GZIP=$(gzip -nfc --best $OUT | wc -c)

echo "$SIZE_SRC bytes original"
echo "$SIZE_MIN bytes minified"
echo "$SIZE_GZIP bytes gzipped"

echo ...done.