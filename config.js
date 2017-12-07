/* Configuration variables */
    var ipfsHost    = 'localhost';
    var ipfsAPIPort = '5001';
    var ipfsWebPort = '8080';
    var web3Host    = 'http://localhost';
    var web3Port    = '8545';

    /* IPFS initialization */
    var ipfs = window.IpfsApi(ipfsHost, ipfsAPIPort)
    ipfs.swarm.peers(function (err, res) {
        if (err) {
            console.error(err);
        } else {
            var numPeers = res.Peers === null ? 0 : res.Peers.length;
            console.log("IPFS - connected to " + numPeers + " peers");
        }
    });

    /* web3 initialization */
    var Web3 = require('web3');
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(web3Host + ':' + web3Port));
    if (!web3.isConnected()) {
        console.error("Ethereum - no connection to RPC server");
    } else {
        console.log("Ethereum - connected to RPC server");
    }
    
    /* JavaScript smart contract interface */
    var contractInterface = [{
        "constant": false,
        "inputs": [{
	        "name": "x",
	        "type": "string"
        }],
        "name": "set",
        "outputs": [],
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [{
	        "name": "x",
	        "type": "string"
        }],
        "type": "function"
    }];

    var account = web3.eth.accounts[0];

    var contractObject = {
        from: account,
        gas: 300000,
        data: '0x6060604052610282806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480634ed3885e146100445780636d4ce63c1461009a57610042565b005b6100986004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610115565b005b6100a760048050506101c6565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101075780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b8060006000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061016457805160ff1916838001178555610195565b82800160010185558215610195579182015b82811115610194578251826000505591602001919060010190610176565b5b5090506101c091906101a2565b808211156101bc57600081815060009055506001016101a2565b5090565b50505b50565b602060405190810160405280600081526020015060006000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102735780601f1061024857610100808354040283529160200191610273565b820191906000526020600020905b81548152906001019060200180831161025657829003601f168201915b5050505050905061027f565b9056'
    };

    var sendDataObject = {
        from: account,
        gas: 300000,
    };

    window.ipfs = ipfs;
    window.web3 = web3;
    window.account = account;
    window.contractObject = contractObject;
    window.contract = web3.eth.contract(contractInterface);
    window.ipfsAddress = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";