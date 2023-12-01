import ABI from "./ABI.json";
import getWeb3 from "../getWeb3";
export const CONTRACT_ADDRESS='0x75d4f9C120f8B41EA49244e9a543fCA830e0eb22';

export const connect=async()=>{
    const web3 = await getWeb3();
    const acnt = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const instance = await new web3.eth.Contract(ABI.ABI,CONTRACT_ADDRESS);
    return {acnt,instance};
}
