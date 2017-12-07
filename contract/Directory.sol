pragma solidity ^0.4.15;

contract Directory {
    string storedData;
    mapping (string => address) locations;

    function set(string x) public {
        storedData = x;
    }

    function get() public constant returns (string x) {
        return storedData;
    }

    function addName(string _name, address location) public {
        locations[_name] = location;
    }
    
    function getAddress(string name) public constant returns (address a) {
        return locations[name];
    }
}