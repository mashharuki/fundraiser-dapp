pragma solidity >= 0.6.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RandomNumberConsumer is VRFConsumerBase {
    // 変数を宣言
    bytes32 public s_keyHash;
    uint256 public s_fee;
    uint256 public randomResult;
    uint256 private constant ROLL_IN_PROGRESS = 42;
    
    mapping(bytes32 => address) private s_rollers;
    mapping(address => uint256) private s_results;
    
    // イベントのて設定
    event DiceRolled(bytes32 indexed requestId, address indexed roller);
    event DiceRolled(bytes32 indexed requestId, address indexed roller);
    event DiceLanded(bytes32 indexed requestId, uint256 indexed result);

    /**
     * コンストラクター
     */
    constructor(address vrfCoordinator, address link, bytes32 keyHash, uint256 fee) public VRFConsumerBase(vrfCoordinator, link) {
        s_keyHash = keyHash;
        s_fee = fee;
    }

    function rollDice(address roller) public onlyOwner returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= s_fee, "Not enough LINK to pay fee");
        require(s_results[roller] == 0, "Already rolled");
        requestId = requestRandomness(s_keyHash, s_fee);
        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 d20Value = randomness.mod(20).add(1);
        s_results[s_rollers[requestId]] = d20Value;
        emit DiceLanded(requestId, d20Value);
    }
    
    function house(address player) public view returns (string memory) {
        require(s_results[player] != 0, "Dice not rolled");
        require(s_results[player] != ROLL_IN_PROGRESS, "Roll in progress");
        return getHouseName(s_results[player]);
    }
    
    function getHouseName(uint256 id) private pure returns (string memory) {
        string[20] memory houseNames = [
            "Targaryen",
            "Lannister",
            "Stark",
            "Tyrell",
            "Baratheon",
            "Martell",
            "Tully",
            "Bolton",
            "Greyjoy",
            "Arryn",
            "Frey",
            "Mormont",
            "Tarley",
            "Dayne",
            "Umber",
            "Valeryon",
            "Manderly",
            "Clegane",
            "Glover",
            "Karstark"
        ];
        return houseNames[id.sub(1)];
    }
    
    /**
     * ランダムな値を取得する関数
     */
    function getRandomNumber (uint256 userProvidedSeed) public returns (bytes32 requestId) {
        return requestRandomness(s_keyHash, s_fee, userProvidedSeed);
    }
    
    /**
     *  ランダムに数字を取得する関数2
     */
    function fulfillRandomness2 (bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness.mod(20).add(1);
    }
}