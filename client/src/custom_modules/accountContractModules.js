import Web3, { providers } from 'web3';
import accountContractAbi from '../contracts/accountContractAbi';
import { accountContractAddress } from '../contracts/contractAddress';
require('dotenv').config();

const web3 = new Web3(
    new providers.HttpProvider(process.env.REACT_APP_INFURA_API_KEY),
);

const contractInstance = new web3.eth.Contract(
    accountContractAbi,
    accountContractAddress,
);

export const checkDoctorIsRegistered = async (priKey) => {
    console.log(priKey);
    const account = web3.eth.accounts.privateKeyToAccount(priKey);
    try {
        const txAccount = await contractInstance.methods
            .accounts(account.address)
            .call();
        return txAccount;
    } catch (error) {
        console.log('error' + error);
    } finally {
        console.log('done');
    }
};
