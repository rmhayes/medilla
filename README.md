# Medilla

Medilla was built on top of Howard Wu's Ethereum + IPFS library (https://github.com/howardwu/IPFS-Ethereum-Storage). I originally cloned this repository, and have based my interactions with the Ethereum contracts and the IPFS node as was modeled in this library.

The name Medilla is completely random. Just needed something to name the repo, put at the top of the page, etc.

### Note: this is still a work in progress.

I will do my best below to explain what I have created, and what I plan to finish up.

## Setup

I'll hopefully have more time to type out more detailed explanation for everything later. For now, reference Howard's setup explanation (https://github.com/howardwu/IPFS-Ethereum-Storage) if you want to play around with it. I think it should cover everything.

To interact with Medilla right now, you will need to open up <b>main.html</b> in a browser. All of the contract setup will be done through the scripts I have provided.

## Contracts

Right now, my code consists of 2 contracts:
1) world.sol
2) directory.sol


#### world.sol
world.sol is a contract for one of the Medilla "worlds". I have a lot of ideas on what functions these can possibly hold down the road. I will elaborate on this more later. For now, the Medilla world functions as a sort pseudoanonymous bulletin board run over Ethereum rather than a central server.

When we want to make a post on the bulletin board, we take the text that is to be added, and put it onto IPFS. We store the hash of this in a file with the hashes of the other messages. We have a <b>Log</b> of hashes, which is also stored on IPFS. In order to keep track of all of our messages, we have an attribute in our smart contract called <b>Data</b>, which is a pointer to the log of hashes on IPFS.

Each world also has a <b>name</b> that can be used to do lookups in the directory. I'm excited to play around with more attributes/characteristics for these worlds to actually make them cool to use, but for now I just want to get some basic functionality down.

#### directory.sol
directory.sol is a contract that serves as a directory for a given set of worlds. In directory.sol, we use a similar storage mechanism to the one used in world.sol. For each world that we add to the directory, we create a log of world names. We then have a pointer <b>Data</b> that points to the location of this log on IPFS.

We also map the name of the world to the location of the contract where it lives. By doing this, we can create a network of World contracts that can be easily accessed by name.

## Deploying

#### Deploying Directories
The first thing that we'll need to do when we open <b>main.html</b> for the first time is to deploy a directory. We can do this with the following command in the browser developer console:

- deployDirectory()

This will create a new directory contract, and deploy it onto the testrpc network. It should also print out the contract address. I want to come up with an easy mechanism to save directory contract addresses, but for now, I'd advise writing it down so you can use the same directory over again! (we'll see this more in the Latch section below).

#### Deploying Worlds
I've made an easy mechanism for deploying worlds! After you've deployed a Directory contract, you'll see a button for Create New World. You'll be prompted to enter a name for the world, and a World contract with the given name will be created and deployed onto the network.

## Latching

In order to be able to access different contracts that you've created in the past, I created a system of switching contexts that I called latching. Essentially, the idea here is that if you've created a contract in the past and you want to keep using it, you can "latch" onto it rather than deploying a fresh contract. I'm sure this is fairly common practice in Solidity development, but I didn't know if it has a name/conventions.

Basically, all latching is is just setting the current contract instances for the given browser window. For both directories and worlds, I have a variable for its address (window.directoryContractAddress, window.worldContractAddress) and its instance (window.directoryContractInstance, window.worldContractInstance). Setting these allows us to work in the context of a given contract.

#### Latching onto Directories

Really easy. If you have the address of the directory, just type in the dev console:

- latchOntoDirectory(address)

And you'll be latched on instantly!

#### Latching onto Worlds

After you latch onto a directory, you should be able to open up a list of all of the worlds in the current directory by clicking the <b>View Worlds</b> button. All of the names in this list will have a button next to them that says <b>Latch</b>. If you want to latch onto a world, simply click the button next to its name.

The World latch actually looks up the address of the given contract name in the Directory contract (uses function getAddress(worldName)), and then uses this address to latch.

## Future Plans

#### Interface

Yeah, obviously there's no UI here (lol). I didn't have much interest in it when I was hacking away at the cooler stuff, but eventually I'll have to actually make it nice/easy to use.

#### World functionality

Will elaborate on further in the future.

## Notes
- This is the first update yay! I hopefully will be fleshing this out over the coming days, but also need to balance with other studying for finals. I apologize if the code behind this seems sloppy - I was hoping to push for as much progress on the base functionality as I could, but obviously this will need a lot of refinement. I'm hoping that once I have more time over break, I can go through all of my code and get feedback from an experienced developer specifically on good Solidity/Javascript conventions and security concerns.