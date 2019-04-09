'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let m = {40:0,21:1,31:2,39:3,30:4,33:5,37:6,25:7,46:8,42:9}
    let arr = Array(9).fill(0);
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 3; j++){
            for(let k = 0; k < 3; k++){
                arr[i] += (j + 2) * (k + 1) * (bankAccount[i*3+j*28+k] == ' ' ? 0 : 1);
            }
        }
    }
    let ans = 0;
    for(let i = 0; i < 9; i++){
        ans *= 10;
        ans += m[arr[i]];
    }
    return ans;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let arr = text.split(' '), buf = '';
    for(var i = 0; i < arr.length; i++){
        if(buf.length + arr[i].length + 1 <= columns)
            buf += (buf.length ? ' ' : '') + arr[i];
        else{
            yield buf;
            buf = arr[i];
        }
    }
    if(buf.length)
        yield buf;
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥'] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠'] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}
function getPokerHandRank(hand) {
    function gotVal(obj, val)   { return Object.keys(obj).map(e=>obj[e]).indexOf(val) != -1 }
    function objSize(obj)       { return Object.keys(obj).length }
    function flush()            { return objSize(suitStat) == 1 }
    function pic(card)          { return card[card.length - 1] }
    function val(card)          { return card.substr(0, card.length - 1) }
    function straight() {
        let arr = [...hand];
        for(let i = 0; i < arr.length - 1; i++)
            if(rank[val(arr[i])] - rank[val(arr[i + 1])] != 1)
                if(val(arr[i]) == 'A')
                    arr.push('1+');
                else
                    return false;
            return true;
    }
    let rank = { 'A': 12, 'K': 11, 'Q': 10, 'J': 9, '10': 8, '9': 7, '8': 6, '7': 5, '6': 4, '5': 3, '4': 2, '3': 1, '2': 0, '1': -1}
    let suitStat = {}, rankStat = {};
    hand.sort((a, b) => rank[val(b)] - rank[val(a)]);
    for(let i = 0; i < hand.length; i++){
        let img = pic(hand[i]);
        let w   = val(hand[i]);
        suitStat[img] = suitStat[img] == undefined ? 1 : suitStat[img] + 1;
        rankStat[w] = rankStat[w] == undefined ? 1 : rankStat[w] + 1;
    }
    if(flush() && straight())
        return PokerRank.StraightFlush;
    if(gotVal(rankStat, 4))
        return PokerRank.FourOfKind;
    if(gotVal(rankStat, 3) && gotVal(rankStat, 2))
        return PokerRank.FullHouse;
    if(flush())
        return PokerRank.Flush;
    if(straight())
        return PokerRank.Straight;
    if(gotVal(rankStat, 3))
        return PokerRank.ThreeOfKind;
    if(objSize(rankStat) == 3)
        return PokerRank.TwoPairs;
    if(objSize(rankStat) == 4)
        return PokerRank.OnePair;
    else
        return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */

function* getFigureRectangles(figure) {
    let W = figure.indexOf('\n');
    let H = (figure.match(/\n/g) || []).length;
    let dp = [...Array(H)].map(e => [...Array(W)].map(i => [0, 0, 0]));
    function chr(y, x) { return figure[y * (W + 1) + x] }
    function ok(y, x) { return x >= 0 && x < W && y >= 0 && y < H && chr(y, x) }
    function rect(w, h) {
        return '+' + '-'.repeat(w - 2) + '+\n' +
              ('|' + ' '.repeat(w - 2) + '|\n').repeat(h - 2) +
               '+' + '-'.repeat(w - 2) + '+\n';
    }
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (chr(i, j) == '+' && ok(i - 1, j - 1) &&
              ((chr(i - 1, j) == '|' && chr(i, j - 1) == '-' && dp[i - 1][j - 1][2] == 1) ||
               (chr(i - 1, j) == '+' && chr(i, j - 1) == '+')))
                yield rect(dp[i - 1][j - 1][0] + 2, dp[i - 1][j - 1][1] + 2);
            else if (chr(i, j) == ' ') {
                if (ok(i - 1, j - 1) && chr(i, j - 1) == '|' && chr(i - 1, j) == '-') {
                    dp[i][j] = [1, 1, 1];
                } else {
                    if (ok(i, j - 1)) {
                        dp[i][j][0] = dp[i][j - 1][0] + 1;
                        dp[i][j][2] = dp[i][j - 1][2];
                    }
                    if (ok(i - 1, j)) {
                        dp[i][j][1] = dp[i - 1][j][1] + 1;
                        dp[i][j][2] = dp[i - 1][j][2];
                    }
                }
            }else
                dp[i][j][2] = 1;
        }
    }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
