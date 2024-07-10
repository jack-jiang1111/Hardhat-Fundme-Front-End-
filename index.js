// in front end, we use import instead of require

import { ethers } from "./ethers-5.6.esm.min.js";
import { abi,contract_address } from "./const.js";


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalanceButton = document.getElementById("getBalance")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
  }
  

// fund function

async function fund(ethAmount){
    ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
            // these two are something get from front end
            // provider /connection to the blockchain
            // signer / wallet / someone with some gas
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            // these two are from local or pre saved
            // contract that we are interacting with
            // ^ ABI & Address
            // yarn harthat node
            const contract = new ethers.Contract(contract_address,abi,signer)
            // inner functions in the contract
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            await listenForTransactionMine(transactionResponse,provider);
            console.log("Fund Done!")
            fundButton.innerHTML = "Finished Fund"
        }
        catch(error){
            console.log(error)
        }
        // const accounts = await ethereum.request({ method: "eth_accounts" })
        // console.log(accounts)
    } 
    else{
        fundButton.innerHTML = "Please install MetaMask"
    }
}


function listenForTransactionMine(transactionResponse,provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    // create a listener for the blockchain
    return new Promise((resolve,reject)=>{
        provider.once(transactionResponse.hash,(transactionReceipt)=>{
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve()
        })
    })
    
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        const balance = await provider.getBalance(contract_address)
        console.log(ethers.utils.formatEther(balance))
      } catch (error) {
        console.log(error)
      }
    } else {
      balanceButton.innerHTML = "Please install MetaMask"
    }
}

async function withdraw(){
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contract_address,abi,signer)
        try {
          const transactionResponse = await contract.withdraw()
          await listenForTransactionMine(transactionResponse,provider)
        } catch (error) {
          console.log(error)
        }
    } else {
        withdrawButton.innerHTML = "Please install MetaMask"
    }
}
// 1. create local node
// yarn hardhat node 

// 2. import local fake account into metamask
// 3. add the local network into the metamask
// network chain id 31337, rpc link is in local node
