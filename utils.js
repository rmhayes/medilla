function initializeLog() {
    console.log("Initializing Log");
    storeAddress("QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH");
}

function storeContent(url) {
    window.ipfs.add(url, function(err, result) {
        if (err) {
            console.error("Content submission error:", err);
            return false;
        } else if (result && result[0] && result[0].Hash) {
            console.log("Content successfully stored. IPFS address:", result[0].Hash);
        } else {
            console.error("Unresolved content submission error");
            return null;
        }
    });
}

function storeNewLog(text) {
    window.ipfs.add(window.ipfs.Buffer.from(text), function(err, result) {
        if (err) {
            console.error("Content submission error:", err);
            return false;
        } else if (result && result[0] && result[0].Hash) {
            console.log("Content successfully stored. IPFS address:", result[0].Hash);
            storeAddress(result[0].Hash);
        } else {
            console.error("Unresolved content submission error");
            return null;
        }
    });
}

function addToLog(hash) {
    if (!window.worldContractInstance) {
        console.error("Storage contract has not been deployed");
        return;
    }

    window.worldContractInstance.get.call(function (err, result) {
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
                        res = hash;
                    } else {
                        res += " - " + hash
                    }
                    console.log('New:', res)
                    storeNewLog(res);
                });
            });
        } else {
            console.error('No data, verify the transaction has been mined');
        }
    });
}

function storeText(text) {
    window.ipfs.add(window.ipfs.Buffer.from(text), function(err, result) {
        if (err) {
            console.error("Content submission error:", err);
            return false;
        } else if (result && result[0] && result[0].Hash) {
            console.log("Content successfully stored. IPFS address:", result[0].Hash);
            addToLog(result[0].Hash);
        } else {
            console.error("Unresolved content submission error");
            return null;
        }
    });
}

function storeTextInField() {
    let text = document.getElementById("textField").value;
    if (text != "") {
        storeText(text);
        document.getElementById("postList").innerHTML += "<li>" + text + "</li>";
        document.getElementById("postList").style.display = "block";
        document.getElementById("noPostWarning").style.display = "none";
        document.getElementById("textField").value = "";
    } 
}

function storeAddress(data) {
    if (!window.worldContractInstance) {
        console.error('Ensure the storage contract has been deployed');
        return;
    }

    if (window.currentData == data) {
        console.error("Overriding existing data with same data");
        return;
    }

    window.worldContractInstance.set.sendTransaction(data, window.sendDataObject, function (err, result) {
        if (err) {
            console.error("Transaction submission error:", err);
        } else {
            window.currentData = data;
            console.log("Address successfully stored. Transaction hash:", result);
        }
    });
}

function fetchContent() {
    if (!window.worldContractInstance) {
        console.error("Storage contract has not been deployed");
        return;
    }

    window.worldContractInstance.get.call(function (err, result) {
        if (err) {
            console.error("Content fetch error:", err);
        } else if (result && window.IPFSHash == result) {
            console.log("New data is not mined yet. Current data: ", result);
            return;
        } else if (result) {
            window.IPFSHash = result;
            var URL = window.ipfsAddress + "/" + result;
            console.log("Content successfully retrieved. IPFS address", result);
            console.log("Content URL:", URL);
        } else {
            console.error('No data, verify the transaction has been mined');
        }
    });
}

function getText(hash) {
    window.ipfs.cat(hash, function (err, stream) {
        var res = ''
        stream.on('data', function (chunk) {
            res += chunk.toString()
        });

        stream.on('error', function (err) {
            console.error('Oh nooo', err)    
        });

        stream.on('end', function () {
            console.log(res);
            document.getElementById('postList').innerHTML += "<li>" + res + "</li>";
        });
    });
}

function getContent() {
    if (!window.worldContractInstance) {
        console.error("Storage contract has not been deployed");
        return;
    }

    window.worldContractInstance.get.call(function (err, result) {
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
                        let hashes = res.split(" - ");
                        document.getElementById("postList").innerHTML = "";
                        document.getElementById("postList").style.display = "block";
                        document.getElementById("noPostWarning").style.display = "none";
                        hashes.forEach(function(hash) {
                            getText(hash);
                        })
                    } else {
                        console.log("empty");
                    }
                });
            });
        } else {
            console.error('No data, verify the transaction has been mined');
        }
    });
}

function getBalance() {
    window.web3.eth.getBalance(window.account, function (err, balance) {
        console.log(parseFloat(window.web3.fromWei(balance, "ether")));
    });
}