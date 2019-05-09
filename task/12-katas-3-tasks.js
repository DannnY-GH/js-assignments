'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true    
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let W = puzzle[0].length, H = puzzle.length;
    let dx = [1, 0, -1, 0], dy = [0, 1, 0, -1];
    let used = [...Array(H)].map(e => Array(W).fill(false));
    function ok(i, j) { return i >= 0 && i < H && j >= 0 && j < W }
    function clear(arr) { for (let i = 0; i < arr.length; i++) arr[i].fill(false); }
    function dfs(y, x, pos) {
        if (pos == searchStr.length)
            return true;
        if (!ok(y, x) || used[y][x] || searchStr[pos] != puzzle[y][x])
            return false;
        used[y][x] = true;
        for (let i = 0; i < 4; i++) {
            let ny = y + dy[i];
            let nx = x + dx[i];
            if (dfs(ny, nx, pos + 1))
                return true;
        }
        used[y][x] = false;
    }
    for (let i = 0; i < puzzle.length; i++)
        for (let j = 0; j < puzzle[0].length; j++) {
            clear(used);
            if (dfs(i, j, 0))
                return true;
        }
    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function swap(str, i, j) { let b = [...str]; let t = b[i]; b[i] = b[j]; b[j] = t; return b.join(''); }
    let list = []
    function perm(start) {
        if (start == chars.length) {
            list.push(chars);
            return;
        }
        for (let i = start; i < chars.length; i++) {
            chars = swap(chars, start, i);
            perm(start + 1);
            chars = swap(chars, start, i);
        }
    }
    perm(0);
    for (let x of list)
        yield x;
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6 ]  => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1 ]  => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let cache = 0, localMax = 0, i = 0;
    while (localMax != quotes.length) {
        for (let j = localMax; j < quotes.length; j++)
            localMax = quotes[localMax] < quotes[j] ? j : localMax;
        while (i != localMax)
            cache += quotes[localMax] - quotes[i++];
        localMax++; i++;
    }
    return cache;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789-_.~!*'();:@&=+$,/?#[]";
}

const storage = new Map();
const P = 107;
function hash(str){
    let h = 0, p_pow = 1;
    for(let i = 0; i < str.length; i++){
        h += str.charCodeAt(i) * p_pow;
        p_pow = p_pow * P;
    }
    return h.toString();
}
UrlShortener.prototype = {

    encode: function (url) {
        let code = hash(url);
        storage.set(code, url);
        return code;
    },

    decode: function (code) {
        return storage.get(code);
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
