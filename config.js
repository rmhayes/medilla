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
    var worldContractInterface = [
        {"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"x","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"x","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}
    ];

    var directoryContractInterface = [
        {"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"location","type":"address"}],"name":"addName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"x","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"name","type":"string"}],"name":"getAddress","outputs":[{"name":"a","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}
    ];

    var account = web3.eth.accounts[0];

    var worldContractObject = {
        from: account,
        gas: 500000,
        data: '0x6060604052341561000f57600080fd5b604051610520380380610520833981016040528080518201919050508060019080519060200190610041929190610048565b50506100ed565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008957805160ff19168380011785556100b7565b828001600101855582156100b7579182015b828111156100b657825182559160200191906001019061009b565b5b5090506100c491906100c8565b5090565b6100ea91905b808211156100e65760008160009055506001016100ce565b5090565b90565b610424806100fc6000396000f300606060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806317d7de7c1461005c5780634ed3885e146100ea5780636d4ce63c14610147575b600080fd5b341561006757600080fd5b61006f6101d5565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100af578082015181840152602081019050610094565b50505050905090810190601f1680156100dc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156100f557600080fd5b610145600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061027d565b005b341561015257600080fd5b61015a610297565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561019a57808201518184015260208101905061017f565b50505050905090810190601f1680156101c75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101dd61033f565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102735780601f1061024857610100808354040283529160200191610273565b820191906000526020600020905b81548152906001019060200180831161025657829003601f168201915b5050505050905090565b8060009080519060200190610293929190610353565b5050565b61029f61033f565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103355780601f1061030a57610100808354040283529160200191610335565b820191906000526020600020905b81548152906001019060200180831161031857829003601f168201915b5050505050905090565b602060405190810160405280600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061039457805160ff19168380011785556103c2565b828001600101855582156103c2579182015b828111156103c15782518255916020019190600101906103a6565b5b5090506103cf91906103d3565b5090565b6103f591905b808211156103f15760008160009055506001016103d9565b5090565b905600a165627a7a72305820400c03019beb33dd45febf04538e338e1afee633f0e4c98f48c6f1033d7861160029'
    }

    var directoryContractObject = {
        from: account,
        gas: 500000,
        data: '0x6060604052341561000f57600080fd5b6105558061001e6000396000f300606060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806315f0e1cc146100675780634ed3885e146100e35780636d4ce63c14610140578063bf40fac1146101ce575b600080fd5b341561007257600080fd5b6100e1600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061026b565b005b34156100ee57600080fd5b61013e600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610319565b005b341561014b57600080fd5b610153610333565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610193578082015181840152602081019050610178565b50505050905090810190601f1680156101c05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101d957600080fd5b610229600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506103db565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b806001836040518082805190602001908083835b6020831015156102a4578051825260208201915060208101905060208303925061027f565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b806000908051906020019061032f929190610470565b5050565b61033b6104f0565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103d15780601f106103a6576101008083540402835291602001916103d1565b820191906000526020600020905b8154815290600101906020018083116103b457829003601f168201915b5050505050905090565b60006001826040518082805190602001908083835b60208310151561041557805182526020820191506020810190506020830392506103f0565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106104b157805160ff19168380011785556104df565b828001600101855582156104df579182015b828111156104de5782518255916020019190600101906104c3565b5b5090506104ec9190610504565b5090565b602060405190810160405280600081525090565b61052691905b8082111561052257600081600090555060010161050a565b5090565b905600a165627a7a7230582024e35521d80356c3b3af94b0575ac8ec7ee17f39ffec8dc839fa261c9c4ae3ac0029'
    }

    var sendDataObject = {
        from: account,
        gas: 300000,
    };

    window.ipfs = ipfs;
    window.web3 = web3;
    window.account = account;
    window.worldContractObject = worldContractObject;
    window.directoryContractObject = directoryContractObject;
    window.worldContract = web3.eth.contract(worldContractInterface);
    window.directoryContract = web3.eth.contract(directoryContractInterface);
    window.ipfsAddress = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";