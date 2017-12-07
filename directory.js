function deployDirectory() {
    window.IPFSHash = null;
    window.currentDirectoryData = null;

    if (window.directoryContractInstance) {
        console.error('Contract already been deployed at: ', window.worldContractAddress);
        return;
    }

    window.directoryContract.new(window.directoryContractObject, function (err, contract) {
        if (err) {
            console.error("Contract deployment error: ", err);
        } else if (contract.address) {
            window.directoryContractAddress = contract.address;
            window.directoryContractInstance = window.directoryContract.at(contract.address);
            console.log("Contract successfully deployed at: ", contract.address);
            // document.getElementById("beforeDeployBody").style.display = "none";
            // document.getElementById("afterDeployBody").style.display = "block";
            // document.getElementById("postList").style.display = "none";
            initializeDirectoryLog();
        } else if (contract.transactionHash) {
            console.log("Awaiting contract deployment with transaction hash: ", contract.transactionHash);
        } else {
            console.error("Unresolved contract deployment error");
        }
    });
}

function initializeDirectoryLog() {
    console.log("Initializing Log");
    storeDirectoryData("QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH");
}

function quickCreate() {
    var name = prompt("Enter a name for your world");
    if (name != null) {
        deployWorld(name);
    }
}

function storeDirectoryData(data) {
    if (!window.directoryContractInstance) {
        console.error('Ensure the directory contract has been deployed');
        return;
    }

    if (window.currentDirectoryData == data) {
        console.error("Overriding existing data with same data");
        return;
    }

    window.directoryContractInstance.set.sendTransaction(data, window.sendDataObject, function (err, result) {
        if (err) {
            console.error("Transaction submission error:", err);
        } else {
            window.currentDirectoryData = data;
            console.log("Address successfully stored. Transaction hash:", result);
        }
    });
}

function createWorld(name) {
    window.directoryContractInstance.get.call(function (err, result) {
        if (err) {
            console.error("Content fetch error:", err);
        } else if (result) {
            window.IPFSHash = result;
            //var URL = window.ipfsAddress + "/" + result;
            //console.log("Content successfully retrieved. IPFS address", result);
            window.ipfs.cat(result, function (err, stream) {
                var res = ''
                stream.on('data', function (chunk) {
                    res += chunk.toString()
                });

                stream.on('error', function (err) {
                    console.error('Oh nooo', err)    
                });

                stream.on('end', function () {
                    console.log('Got:', res)
                    if (res == "") {
                        res = name;
                    } else {
                        res += " - " + name
                    }
                    console.log('New:', res)
                    storeNewDirectoryLog(res);
                });
            });
        } else {
            console.error('No data, verify the transaction has been mined');
        }
    });
}

function deployWorld(name) {
    window.worldIPFSHash = null;
    window.currentWorldData = null;

    if (window.worldContractInstance) {
        console.error('Contract already been deployed at: ', window.worldContractAddress);
        return;
    }

    window.worldContract.new(name, window.worldContractObject, function (err, contract) {
        if (err) {
            console.error("Contract deployment error: ", err);
        } else if (contract.address) {
            window.worldContractAddress = contract.address;
            window.worldContractInstance = window.worldContract.at(contract.address);
            console.log("Contract successfully deployed at: ", contract.address);
            document.getElementById("beforeDeployBody").style.display = "none";
            document.getElementById("afterDeployBody").style.display = "block";
            document.getElementById("postList").style.display = "none";
            initializeLog();
            addToDirectory(name, window.worldContractAddress);
            createWorld(name);
        } else if (contract.transactionHash) {
            console.log("Awaiting contract deployment with transaction hash: ", contract.transactionHash);
        } else {
            console.error("Unresolved contract deployment error");
        }
    });
}

function addToDirectory(name, address) {
    window.directoryContractInstance.addName(name, address, window.sendDataObject, function (err, result) {
        if (err) {
            console.error("Transaction submission error:", err);
        } else {
            console.log("Name mapped to address");
        }
    });
}

function getWorldAddress(name) {
    window.directoryContractInstance.getAddress.call(name, function(err, result) {
        console.log(result);
    });
}

function getWorldList() {
    window.directoryContractInstance.get.call(function (err, result) {
        if (err) {
            console.error("Content fetch error:", err);
        } else if (result) {
            window.IPFSHash = result;
            //var URL = window.ipfsAddress + "/" + result;
            //console.log("Content successfully retrieved. IPFS address", result);
            window.ipfs.cat(result, function (err, stream) {
                var res = ''
                stream.on('data', function (chunk) {
                    res += chunk.toString()
                });

                stream.on('error', function (err) {
                    console.error('Oh nooo', err)    
                });

                stream.on('end', function () {
                    console.log('Got:', res)
                    if (res != "") {
                        console.log("split hashes: ")
                        let names = res.split(" - ");
                        document.getElementById("directoryList").innerHTML = ""
                        names.forEach(function(name) {
                            document.getElementById("directoryList").innerHTML += "<li>" + name + "</li><button onclick=\"latchToWorld('" + name + "')\">Latch</button>"
                        });
                    } else {
                        document.getElementById("directoryList").innerHTML = "No worlds exist"
                    }
                });
            });
        } else {
            console.error('No data, verify the transaction has been mined');
        }
    });
}

function storeNewDirectoryLog(text) {
    window.ipfs.add(window.ipfs.Buffer.from(text), function(err, result) {
        if (err) {
            console.error("Content submission error:", err);
            return false;
        } else if (result && result[0] && result[0].Hash) {
            console.log("Content successfully stored. IPFS address:", result[0].Hash);
            storeDirectoryData(result[0].Hash);
        } else {
            console.error("Unresolved content submission error");
            return null;
        }
    });
}

// deployDirectory();