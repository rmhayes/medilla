pragma solidity ^0.4.15;

contract World {
    string storedData;
    string name;
    function World(string _name) public {
        name = _name;
    }

    function set(string x) public {
        storedData = x;
    }

    function get() public constant returns (string x) {
        return storedData;
    }
}
