function md5_binary(str) {
    var x = Array();
    var s11 = 7, s12 = 12, s13 = 17, s14 = 22;
    var s21 = 5, s22 = 9, s23 = 14, s24 = 20;
    var s31 = 4, s32 = 11, s33 = 16, s34 = 23;
    var s41 = 6, s42 = 10, s43 = 15, s44 = 21;

    var a = 0x67452301;
    var b = 0xefcdab89;
    var c = 0x98badcfe;
    var d = 0x10325476;

    var x = strToLittleEndianArray(str);

    var strBit = str.length * charBit;

    x[strBit >> 5] |= 0x80 << (strBit & 0x1f);
    x[(((strBit + 64) >>> 9) << 4) + 14] = strBit;

    var len = x.length;

    for (var k = 0; k < len; k += 16) {
        var aa = a, bb = b, cc = c, dd = d;
        a = ff(a, b, c, d, x[k + 0], s11, 0xd76aa478);
        d = ff(d, a, b, c, x[k + 1], s12, 0xe8c7b756);
        c = ff(c, d, a, b, x[k + 2], s13, 0x242070db);
        b = ff(b, c, d, a, x[k + 3], s14, 0xc1bdceee);
        a = ff(a, b, c, d, x[k + 4], s11, 0xf57c0faf);
        d = ff(d, a, b, c, x[k + 5], s12, 0x4787c62a);
        c = ff(c, d, a, b, x[k + 6], s13, 0xa8304613);
        b = ff(b, c, d, a, x[k + 7], s14, 0xfd469501);
        a = ff(a, b, c, d, x[k + 8], s11, 0x698098d8);
        d = ff(d, a, b, c, x[k + 9], s12, 0x8b44f7af);
        c = ff(c, d, a, b, x[k + 10], s13, 0xffff5bb1);
        b = ff(b, c, d, a, x[k + 11], s14, 0x895cd7be);
        a = ff(a, b, c, d, x[k + 12], s11, 0x6b901122);
        d = ff(d, a, b, c, x[k + 13], s12, 0xfd987193);
        c = ff(c, d, a, b, x[k + 14], s13, 0xa679438e);
        b = ff(b, c, d, a, x[k + 15], s14, 0x49b40821);
        a = gg(a, b, c, d, x[k + 1], s21, 0xf61e2562);
        d = gg(d, a, b, c, x[k + 6], s22, 0xc040b340);
        c = gg(c, d, a, b, x[k + 11], s23, 0x265e5a51);
        b = gg(b, c, d, a, x[k + 0], s24, 0xe9b6c7aa);
        a = gg(a, b, c, d, x[k + 5], s21, 0xd62f105d);
        d = gg(d, a, b, c, x[k + 10], s22, 0x2441453);
        c = gg(c, d, a, b, x[k + 15], s23, 0xd8a1e681);
        b = gg(b, c, d, a, x[k + 4], s24, 0xe7d3fbc8);
        a = gg(a, b, c, d, x[k + 9], s21, 0x21e1cde6);
        d = gg(d, a, b, c, x[k + 14], s22, 0xc33707d6);
        c = gg(c, d, a, b, x[k + 3], s23, 0xf4d50d87);
        b = gg(b, c, d, a, x[k + 8], s24, 0x455a14ed);
        a = gg(a, b, c, d, x[k + 13], s21, 0xa9e3e905);
        d = gg(d, a, b, c, x[k + 2], s22, 0xfcefa3f8);
        c = gg(c, d, a, b, x[k + 7], s23, 0x676f02d9);
        b = gg(b, c, d, a, x[k + 12], s24, 0x8d2a4c8a);
        a = hh(a, b, c, d, x[k + 5], s31, 0xfffa3942);
        d = hh(d, a, b, c, x[k + 8], s32, 0x8771f681);
        c = hh(c, d, a, b, x[k + 11], s33, 0x6d9d6122);
        b = hh(b, c, d, a, x[k + 14], s34, 0xfde5380c);
        a = hh(a, b, c, d, x[k + 1], s31, 0xa4beea44);
        d = hh(d, a, b, c, x[k + 4], s32, 0x4bdecfa9);
        c = hh(c, d, a, b, x[k + 7], s33, 0xf6bb4b60);
        b = hh(b, c, d, a, x[k + 10], s34, 0xbebfbc70);
        a = hh(a, b, c, d, x[k + 13], s31, 0x289b7ec6);
        d = hh(d, a, b, c, x[k + 0], s32, 0xeaa127fa);
        c = hh(c, d, a, b, x[k + 3], s33, 0xd4ef3085);
        b = hh(b, c, d, a, x[k + 6], s34, 0x4881d05);
        a = hh(a, b, c, d, x[k + 9], s31, 0xd9d4d039);
        d = hh(d, a, b, c, x[k + 12], s32, 0xe6db99e5);
        c = hh(c, d, a, b, x[k + 15], s33, 0x1fa27cf8);
        b = hh(b, c, d, a, x[k + 2], s34, 0xc4ac5665);
        a = ii(a, b, c, d, x[k + 0], s41, 0xf4292244);
        d = ii(d, a, b, c, x[k + 7], s42, 0x432aff97);
        c = ii(c, d, a, b, x[k + 14], s43, 0xab9423a7);
        b = ii(b, c, d, a, x[k + 5], s44, 0xfc93a039);
        a = ii(a, b, c, d, x[k + 12], s41, 0x655b59c3);
        d = ii(d, a, b, c, x[k + 3], s42, 0x8f0ccc92);
        c = ii(c, d, a, b, x[k + 10], s43, 0xffeff47d);
        b = ii(b, c, d, a, x[k + 1], s44, 0x85845dd1);
        a = ii(a, b, c, d, x[k + 8], s41, 0x6fa87e4f);
        d = ii(d, a, b, c, x[k + 15], s42, 0xfe2ce6e0);
        c = ii(c, d, a, b, x[k + 6], s43, 0xa3014314);
        b = ii(b, c, d, a, x[k + 13], s44, 0x4e0811a1);
        a = ii(a, b, c, d, x[k + 4], s41, 0xf7537e82);
        d = ii(d, a, b, c, x[k + 11], s42, 0xbd3af235);
        c = ii(c, d, a, b, x[k + 2], s43, 0x2ad7d2bb);
        b = ii(b, c, d, a, x[k + 9], s44, 0xeb86d391);

        a = modularAdd(a, aa);
        b = modularAdd(b, bb);
        c = modularAdd(c, cc);
        d = modularAdd(d, dd);
    }
    return Array(a, b, c, d);

    function f(x, y, z) {
        return (x & y) | ((~x) & z);
    };

    function g(x, y, z) {
        return (x & z) | (y & (~z));
    };

    function h(x, y, z) {
        return (x ^ y ^ z);
    };

    function i(x, y, z) {
        return (y ^ (x | (~z)));
    };

    function ff(a, b, c, d, x, s, ac) {
        return modularAdd(rotateLeft(modularAdd(a, modularAdd(modularAdd(f(b, c, d), x), ac)), s), b);
    };

    function gg(a, b, c, d, x, s, ac) {
        return modularAdd(rotateLeft(modularAdd(a, modularAdd(modularAdd(g(b, c, d), x), ac)), s), b);
    };

    function hh(a, b, c, d, x, s, ac) {
        return modularAdd(rotateLeft(modularAdd(a, modularAdd(modularAdd(h(b, c, d), x), ac)), s), b);
    };

    function ii(a, b, c, d, x, s, ac) {
        return modularAdd(rotateLeft(modularAdd(a, modularAdd(modularAdd(i(b, c, d), x), ac)), s), b);
    };
};

function md5(str) {
    return littleEndianArrayToHex(md5_binary(str));
};
/**
 * Add binary-safe padding to a string.
 *
 * @param string the string to add padding
 * @param int number for the string be divisible by
 * @param int the string length
 * @return the padded string
 * @author www.farfarfar.com
 * @version 0.2
 */


var charBit = 8;

var standardPadding = false;

function addPadding(str, divisible, len) {
    if (divisible % len != 0)
        var paddingLen = divisible - (len % divisible);
    else
        var paddingLen = 0;

    if (standardPadding) {
        for (var i = 0; i < paddingLen; i++) {
            str += String.fromCharCode(paddingLen);
        }
    } else {
        for (var i = 0; i < paddingLen; i++) {
            str += String.fromCharCode(0);
        }
    }

    return str;
};

/**
 * Remove binary-safe padding from a string
 *
 * @param string the string to remove padding
 * @param int the string length
 * @return the unpadded string
 * @author www.farfarfar.com
 * @version 0.1
 */

function removePadding(str, len) {
    if (standardPadding) {
        return str.substr(0, len - (str.charCodeAt(str.length - 1)));
    } else {
        return str;
    }
};

/**
 * Converts a string into a little endian binary array
 *
 * @param string the string to convert
 * @return int[]
 * @author www.farfarfar.com
 * @version 0.1
 */

function strToLittleEndianArray(str) {
    var x = Array();
    var mask = (1 << charBit) - 1;

    var len = str.length;

    for (var i = 0, j = 0; j < len; i += charBit) {
        x[i >> 5] |= (str.charCodeAt(j++) & mask) << (i & 0x1f);
    }

    return x;
};

/**
 * Converts a string into a big endian binary array
 *
 * @param string the string to convert
 * @return int[]
 * @author www.farfarfar.com
 * @version 0.1
 */

function strToBigEndianArray(str) {
    var x = Array();
    var mask = (1 << charBit) - 1;

    var len = str.length;

    var i = 0;

    for (var j = 0; j < len; i += charBit) {
        x[i >> 5] |= (str.charCodeAt(j++) & mask) << (32 - charBit - (i & 0x1f));
    }

    return x;
};

/**
 * Converts a little endian binary array into a hex-formatted string
 *
 * @param int[] the array to convert
 * @return string
 * @author www.farfarfar.com
 * @version 0.1
 */

function littleEndianArrayToHex(ar) {
    var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

    var str = "";

    var len = ar.length;

    for (var i = 0, tmp = len << 2; i < tmp; i++) {
        str += charHex[((ar[i >> 2] >> (((i & 3) << 3) + 4)) & 0xF)] +
            charHex[((ar[i >> 2] >> ((i & 3) << 3)) & 0xF)];
    }

    return str;
};

/**
 * Converts a big endian binary array into a hex-formatted string
 *
 * @param int[] the array to convert
 * @return string
 * @author www.farfarfar.com
 * @version 0.1
 */

function bigEndianArrayToHex(ar) {
    var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

    var str = "";

    var len = ar.length;

    for (var i = 0, tmp = len << 2; i < tmp; i++) {
        str += charHex[((ar[i >> 2] >> (((3 - (i & 3)) << 3) + 4)) & 0xF)] +
            charHex[((ar[i >> 2] >> ((3 - (i & 3)) << 3)) & 0xF)];
    }

    return str;
};

/**
 * @param int the integer to rotate
 * @param int the distance to rotate left
 * @return int
 */

function rotateLeft(val, n) {
    return (val << n) | (val >>> (32 - n));
};

/**
 * @param int the integer to rotate
 * @param int the distance to rotate right
 * @return int
 */

function rotateRight(val, n) {
    return ( val >>> n ) | (val << (32 - n));
};

/**
 * @param int the first integer
 * @param int the second integer
 * @return int
 */

function modularAdd(a, b) {
    var lowerSum = (a & 0xffff) + (b & 0xffff);
    var upperSum = (a >> 16) + (b >> 16) + (lowerSum >> 16);
    return (upperSum << 16) + (lowerSum & 0xffff);
};

/**
 * @param int the first integer
 * @param int the second integer
 * @return int
 */

function modularSubtract(a, b) {
    return modularAdd(a, -b);
};

function binxor(l, r) {
    var x = ((l < 0) ? (l + 4294967296) : l)
        ^ ((r < 0) ? (r + 4294967296) : r);
    return ((x < 0) ? x + 4294967296 : x);
};

/**
 * Unencodes a hex-encoded string to a binary string
 * @param str the string to unencode
 * @return string the unencoded string
 * @author www.farfarfar.com
 */

function hexToStr(str) {
    var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
    var stringHex = "0123456789abcdef";

    var out = "";
    var len = str.length;
    str = new String(str);
    str = str.toLowerCase();
    if ((len % 2) == 1) {
        str += "0";
    }
    for (var i = 0; i < len; i += 2) {
        var s1 = str.substr(i, 1);
        var s2 = str.substr(i + 1, 1);
        var index1 = stringHex.indexOf(s1);
        var index2 = stringHex.indexOf(s2);

        if (index1 == -1 || index2 == -1) {
            throw HEX_BROKEN;
        }

        var val = (index1 << 4) | index2;

        out += "" + String.fromCharCode(parseInt(val));
    }
    return out;
};

/**
 * Encodes a string string to a hex-encoded string
 * @param str the string to unencode
 * @return string the unencoded string
 * @author www.farfarfar.com
 */

function strToHex(str) {
    var charHex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

    var out = "";
    var len = str.length;
    str = new String(str);
    for (var i = 0; i < len; i++) {
        var s = str.charCodeAt(i);
        var h = "" + charHex[s >> 4] + "" + charHex[0xf & s];

        out += "" + h;
    }
    return out;
};

/**
 * Converts a string to an array of longs
 *
 * @param string the string to convert
 * @return long[]
 * @version 0.1
 */
function strToInt(str) {
    var ar = new Array();

    var len = str.length;

    var i = 0;
    var j = 0;

    do {
        ar[j++] = str.charCodeAt(i++) +
            (str.charCodeAt(i++) << 8) +
            (str.charCodeAt(i++) << 16) +
            (str.charCodeAt(i++) << 24);
    } while (i < len);

    return ar;
};

/**
 * Converts an array of longs to a string
 *
 * @param long[] the array to convert
 * @return string
 * @version 0.1
 */

function intToStr(ar) {
    var len = ar.length;
    for (var i = 0; i < len; i++) {
        ar[i] = String.fromCharCode(ar[i] & 0xff, ar[i] >>> 8 & 0xff,
            ar[i] >>> 16 & 0xff, ar[i] >>> 24 & 0xff);
    }
    return ar.join('');
};


