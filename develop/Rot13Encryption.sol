pragma solidity >= 0.4.22;

/**
 * 暗号化コントラクト
 */
contract Rot13Encryption {
    // イベントを設定
    event Result(string convertedString);

    // rot13-encrypt a string
    // @text 暗号化する文字列
    function rot13Encrypt (string text) public {
        // 文字列数を取得
        uint256 length = bytes(text).length;
        // 暗号化する。
        for (var i = 0; i < length; i++) {
            byte char = bytes(text)[i];
            // 文字列を変更するためのインラインアセンブリ
            assembly {
                // get the first byte
                char := byte(0,char)
                // if the character is in [n,z], i.e. wrapping
                if and(gt(char,0x6D), lt(char,0x7B))
                // subtract from the ASCII number 'a',
                // the difference between character <char> and 'z'
                { char:= sub(0x60, sub(0x7A,char)) }
                // スペース無視
                if iszero(eq(char, 0x20))
                // add 13 to char
                {mstore8(add(add(text,0x20), mul(i,1)), add(char,13))}
            }
        }
        // イベントの呼び出し
        emit Result(text);
    }

    // 複合化するための関数
    function rot13Decrypt (string text) public {
        uint256 length = bytes(text).length;
        for (var i = 0; i < length; i++) {
            byte char = bytes(text)[i];
            assembly {
                char := byte(0,char)
                if and(gt(char,0x60), lt(char,0x6E))
                { char:= add(0x7B, sub(char,0x61)) }
                if iszero(eq(char, 0x20))
                {mstore8(add(add(text,0x20), mul(i,1)), sub(char,13))}
            }
        }
        // イベントの呼び出し
        emit Result(text);
    }
}