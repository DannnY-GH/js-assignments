'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    var ans = [];
    function first_name(i){
        return sides[Math.floor(i/8)%4];
    }
    function second_name(i){
        return sides[(Math.floor(((i+8)/16))%2*2)%4]+sides[(Math.floor(i/16)*2+1)%4];
    }
    function third_name(i){
        return first_name(i+2) + second_name(i);
    }
    function fourth_name(i){
        let name = '';
        if((i % 8) == 1)
            name += first_name(i);
        else if((i % 8) == 7)
            name += first_name(i + 8);
        else 
            name += second_name(i + 1);
        name += 'b';
        name += (i % 4 == 1)? first_name(i + 8): first_name(i);
        return name;
    }
    for(var i = 0, az = 0; i < 32; i++, az += 11.25){
        var name = '';
        if(i % 8 == 0){
            name = first_name(i);
        }else if(i % 4 == 0){
            name = second_name(i);
        }else if(i % 2 == 0){
            name = third_name(i);
        }else{
            name = fourth_name(i);
        }
        ans.push({abbreviation: name, azimuth: az});
    }
    return ans;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let ans = [str];
    const regex = /\{[^\{\}]*?\}/g;
    let stop = false;
    while (!stop) {
        stop = true;
        let tmp = [];
        for (let str of ans) {
            let matches = str.match(regex);
            if (matches) {
                stop = false;
                let variants = matches[0].slice(1, -1).split(',');
                for (let option of variants) {
                    tmp.push(str.replace(matches[0], option));
                }
            } else {
                tmp.push(str);
            }
        }
        ans = tmp;
    }
    ans = [...new Set(ans)];
    for (let e of ans)
        yield e;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    var arr = [...Array(n)].map(e=>new Array(n).fill(0));
    let i = 0, j = 1;
    let ind = 1;
    function ok(){
        return i >= 0 && j >= 0 && i < n && j < n;
    }
    while(ok()){
        while(ok())
            arr[i++][j--] = ind++;
        i--; j++;
        (i == n-1) ? j++ : i++;
        while(ok())
            arr[i--][j++] = ind++;
        i++; j--;
        (j == n-1) ? i++ : j++;
    }
    return arr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let used = [...Array(dominoes.length)].fill(false);
    function canArrange(start, cnt){
        if(cnt == 0)
            return true;
        for(var i = 0; i < dominoes.length; i++){
            if(start === null || !used[i]){
                let yep = false;
                used[i] = true;
                if(dominoes[i][0] == start || start === null)
                    yep |= canArrange(dominoes[i][1], cnt - 1);
                if(dominoes[i][1] == start || start === null)
                    yep |= canArrange(dominoes[i][0], cnt - 1);
                used[i] = false;
                if(yep)
                    return true;
            }
        }
        return false;
    }
    return canArrange(null, dominoes.length);
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let tmp = [];
    let str = '';
    function flush(){
        if(tmp.length > 2)
           str += tmp[0] + '-' + tmp[tmp.length - 1] + ',';
        else{
            str += tmp.join(',') + ',';
        }
        tmp = [];
    }
    for(var x of nums){
        if(!tmp.length || (x-tmp[tmp.length - 1]) == 1){
            tmp.push(x);
        }else{
            flush();
            tmp.push(x);
        }
    }
    if(tmp.length)
        flush();
    return str.slice(0, str.length - 1);
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
