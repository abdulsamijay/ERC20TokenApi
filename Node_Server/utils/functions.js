// var exports = module.exports = {}

var axios = require('axios');
var Web3 = require('web3')
var constants = require('./constant');

const OPTIONS = {
    // defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

const web3 = new Web3("http://localhost:7545", null, OPTIONS) // for rinkeby test net


const contract = new web3.eth.Contract(constants.ABI, constants.CONTRACT_ADDRESS)

exports.allowance = async (spender) => {
    try {
        let result = await contract.methods.allowance(constants.PUBLIC_KEY, spender).call();
        return result;
    }
    catch (e) {

    }
}

exports.approve = async (spender, amount) => {
    let txCount = await web3.eth.getTransactionCount(constants.PUBLIC_KEY, "pending");

        let gasPrices = await exports.getCurrentGasPrices();
        amount = await web3.utils.toWei(amount.toString());
        var rawTransaction = {
            from:constants.PUBLIC_KEY,
            to:  constants.CONTRACT_ADDRESS,
            data: contract.methods.approve(spender, amount ).encodeABI(), //contract.methods.methodName(parameters).encodeABI
            gasPrice: gasPrices.medium * 1000000000,
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(300000),
            chainId: 5777 //EIP 155 chainId - mainnet: 1, rinkeby: 4
        }

        let tx = await web3.eth.accounts.signTransaction(rawTransaction, constants.PRIVATE_KEY)
         
        let sTx = await web3.eth.sendSignedTransaction(tx.rawTransaction)
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (confirmationNumber === 1) {
                        console.log(receipt)
                    }
                })
                .on('error', (error) => {
                    console.log(error)
                })
                .on('transactionHash', async (hash) => {
                    console.log(hash);
                })
                .catch(e => {
                console.log(e)
            });

        return sTx;

}

exports.transfer = async (to, amount) => {

        let txCount = await web3.eth.getTransactionCount(constants.PUBLIC_KEY, "pending");

        let gasPrices = await exports.getCurrentGasPrices();
        amount = await web3.utils.toWei(amount.toString());
        var rawTransaction = {
            from:constants.PUBLIC_KEY,
            to:  constants.CONTRACT_ADDRESS,
            value:0,
            data: contract.methods.transfer(to, amount ).encodeABI(), //contract.methods.methodName(parameters).encodeABI
            gasPrice: gasPrices.medium * 1000000000,
            nonce: web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(300000),
            chainId: 5777 //EIP 155 chainId - mainnet: 1, rinkeby: 4
        }

        let tx = await web3.eth.accounts.signTransaction(rawTransaction, constants.PRIVATE_KEY)
         
        let sTx = await web3.eth.sendSignedTransaction(tx.rawTransaction)
                .on('confirmation', (confirmationNumber, receipt) => {
                    if (confirmationNumber === 1) {
                        console.log(receipt)
                    }
                })
                .on('error', (error) => {
                    console.log(error)
                })
                .on('transactionHash', async (hash) => {
                    console.log(hash);
                })
                .catch(e => {
                console.log(e)
            });

        return sTx;
}

exports.transferFrom = async (from_add, to_add, amount ,fpk) => {

    let txCount = await web3.eth.getTransactionCount(from_add);

    let gasPrices = await exports.getCurrentGasPrices();
    amount = await web3.utils.toWei(amount.toString());
    var rawTransaction = {
        from: from_add,
        to:  constants.CONTRACT_ADDRESS,
        value:0,
        data: contract.methods.transferFrom(constants.PUBLIC_KEY, from_add, amount ).encodeABI(), //contract.methods.methodName(parameters).encodeABI
        gasPrice: gasPrices.medium * 1000000000,
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(300000),
        chainId: 5777 //EIP 155 chainId - mainnet: 1, rinkeby: 4
    }

    let tx = await web3.eth.accounts.signTransaction(rawTransaction, fpk)
     
    let sTx = await web3.eth.sendSignedTransaction(tx.rawTransaction)
            .on('confirmation', (confirmationNumber, receipt) => {
                if (confirmationNumber === 1) {
                    console.log(receipt)
                }
            })
            .on('error', (error) => {
                console.log(error)
            })
            .on('transactionHash', async (hash) => {
                console.log(hash);
            })
            .catch(e => {
            console.log(e)
        });

    return sTx;
}


/*** to get data from smart contract ***/
exports.getBalanceOf = async (address)=>{
    try{
        let getData = await contract.methods.balanceOf(address).call();
        let amount = await web3.utils.fromWei(getData)
        return amount;
    }catch (e) {

    }
}

exports.getCurrentGasPrices = async () => {
    try {
        let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
        let prices = {
            low: response.data.safeLow / 10,
            medium: response.data.average / 10,
            high: response.data.fast / 10
        };

        return prices;
    } catch (e) {
        console.log(e)
    }

};

exports.getNonceByEthAddress = async (eth_address) => {
    try {
        let nonce = await web3.eth.getTransactionCount(eth_address, "pending");
        console.log(nonce);
        return nonce;

    } catch (e) {

    }
}

