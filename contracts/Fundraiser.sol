pragma solidity >0.4.23;

import "@openzeppelin/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Fundraiser is Ownable {
    // SafeMathが適用されるように設定する。
    using SafeMath for uint256;
    // 変数を宣言する。
    string public name;
    string public url;
    string public imageURL;
    string public description; 
    // 受取人のアドレス
    address payable public beneficiary;
    // 管理人のアドレス
    address public custodian;
    // 構造体
    struct Donation {
        uint256 value;
        uint256 date; 
    }
    // 寄付者と寄付情報を保持するためのmap
    mapping (address => Donation[]) private _donations;
    // 寄付総額
    uint256 public totalDonations;
    // 寄付件数
    uint256 public donationsCount;

    // 寄付を受け取った時のイベントを定義する。
    event DonationReceived (address indexed donor, uint256 value);
    // 残高を送金したときのイベントを定義する。
    event Withdraw(uint256 amount);

    /**
     * コンストラクター
     */
    constructor (string memory _name, string memory _url, string memory _imageURL, string memory _description, address payable _beneficiary, address _custodian) public {
        name = _name;
        url = _url;
        imageURL = _imageURL;
        description = _description;
        beneficiary = _beneficiary;
        transferOwnership(_custodian);
    }

    /**
     * 受取人のアドレスを設定する関数
     */
    function setBeneficiary (address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    /**
     * 寄付数をカウントする関数
     */
    function myDonationsCount () public view returns (uint256) {
        return _donations[msg.sender].length;
    }

    /**
     * 寄付を実行するdonate関数
     */
    function donate () public payable {
        // 寄付の情報をセットする。
        Donation memory donation = Donation({
            value: msg.value,
            date: block.timestamp
        });
        // マップ変数に追加する。
        _donations[msg.sender].push(donation);
        // 寄付総額の算出
        totalDonations = totalDonations.add(msg.value);
        // 寄付件数を増やす。
        donationsCount++;
        // イベントを発行する。
        emit DonationReceived (msg.sender, msg.value);
      }

    /**
     * 寄付のリストを作成する。
     */
    function myDonations () public view returns (uint256[] memory values, uint256[] memory dates) {
        // 寄付数を取得する。
        uint256 count = myDonationsCount();
        values = new uint256[](count);
        dates = new uint256[](count);
        // 寄付のリストを作成する。
        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = _donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }
        return (values, dates);
    }

    /**
     * 資金を引き出すための関数
     */
    function withdraw () public onlyOwner {
        // コントラクトの残高を取得する。
        uint256 balance = address(this).balance;
        // 送金する。
        beneficiary.transfer(balance);
        // イベントを発行する。
        emit Withdraw(balance);
    }

    /**
     * フォールバック関数
     */
    fallback () external payable {
        // 寄付総額を追加する。
        totalDonations = totalDonations.add(msg.value);
        // 寄付件数を増加する。
        donationsCount++;
    }
}