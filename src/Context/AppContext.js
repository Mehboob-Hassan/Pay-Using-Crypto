import { useState, createContext, useContext } from "react";
import { Contract, ethers, providers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import axios from "axios";

const AppContext = createContext();

const PaymentContext = (props) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [address, setAddress] = useState(undefined);
  const [priceInToken, setPriceInToken] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTokenName, setCurrentTokenName] = useState("");
  const [currentTokenPrice, setCurrentTokenPrice] = useState("");


  //=========CONNECT WALLET====
  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const web3Modal = new Web3Modal();
      const web3Provider = await web3Modal.connect();
      const provider = new providers.Web3Provider(web3Provider);
      const signer = provider.getSigner();

      const address = await signer.getAddress();
      console.log(address);
      setAddress(address);
      if (needSigner) {
        return signer;
      }
      return provider;
    } catch (error) {
      console.log(error.message)
    }
  }

  // =================Buy Using Ether
  const buyUsingEther = async (chainId) => {
    const signer = await getProviderOrSigner();
    const network = await signer.getNetwork();
    if (network.chainId !== chainId) {
      if (typeof (ethereum) !== undefined) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId, }]
          })
          // Reload the page to reflect the updated chain
          window.location.reload();
        } catch (error) {
          console.log(error.message);
        }
      }

    }

  }


  //====================BUY USING TOKEN========================
  // To address will be dynamic
  const toAddress = '0x4c2BA22D31d59855FFC0eda1fBfdEdD610CDb730';
  let contractAdress;
  let DECIMAL;


  const getTokenAmount = async (tokenName, price) => {
    console.log(tokenName);

    // get token Contract address and decimals by using their symbol
    switch (tokenName) {
      case 'USDC':
        contractAdress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
        DECIMAL = 6;
        break;
      case 'DOGE':
        contractAdress = '0x37ac88EcFe9BE24F3d1e03fcB0bCEd986832f8D3';
        DECIMAL = 18;
        break;
      case 'LTC':
        contractAdress = '0x8A732BC91c33c167F868E0af7e6f31e0776d0f71';
        DECIMAL = 18;
        break;
      case 'SHIB':
        contractAdress = '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE';
        DECIMAL = 18;
        break;
      case 'DAI':
        contractAdress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
        DECIMAL = 18;
        break;
      case 'APE':
        contractAdress = '0x4d224452801ACEd8B2F0aebE155379bb5D594381';
        DECIMAL = 18;
        break;
      default:
        contractAdress = 'NA';
        DECIMAL = 'NA';
        break;
    }
    // Get prices converted from USD to token
    console.log("This is token Name", tokenName);
    await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${tokenName}&tsyms=${tokenName},USD`)
      .then((data) => {
        
        const token = data.data.USD;

        console.log("Token inside axios", token);
        const oneUSD = (1 / token);
        console.log(oneUSD);
        // setPriceInToken(Number((price * oneUSD).toFixed(6)));   ->  We can do this if decimal problem occure
        const _price = price * oneUSD;
        console.log("This is _price", _price);
        setPriceInToken(_price);
      }).catch((err) => {
        console.log(err);
      })

    return { contractAdress, DECIMAL };
  }



  // Instead of getting whole abi,, I just defined this one
  // Cuz we only need transfer function
  const abi = ["function transfer(address to, uint amount)"];

  const buyUsingToken = async (tokenName, price) => {
    try {
      setIsOpen(true);
      await getTokenAmount(tokenName, price);
      setCurrentTokenName(tokenName);
      setCurrentTokenPrice(price);
    } catch (error) {
      console.log("Error in Buy Using Token", error.message);
    }
  }

  const handleBuyUsingTokenSubmit = async()=>{
    try {
      console.log(currentTokenName);
      console.log("this is price in Buy Using Token", currentTokenPrice);
      const { contractAdress, DECIMAL } = await getTokenAmount(currentTokenName, currentTokenPrice);
      const signer = await getProviderOrSigner(true);
      console.log(contractAdress, DECIMAL)
      const erc20 = new Contract(contractAdress, abi, signer);
      console.log("this is price in Token", priceInToken);
  
      const amount = utils.parseUnits(priceInToken.toString(), DECIMAL);
      console.log("Amount in Tokens in ", amount)
      await erc20.transfer(toAddress, amount);
    } catch (error) {
        console.log("Error in handleBuyUsingTokenSubmit:", error.message);
    }
  }


  // =========================================
  // Close Model
  const closeModal = async()=>{
    setIsOpen(false);
  }

  //==========================================


  // CONNECT WALLET
  const connectWallet = async () => {
    await getProviderOrSigner();
    setIsWalletConnected(true);
  }


  return (
    <AppContext.Provider value={{ getProviderOrSigner,  buyUsingEther, connectWallet, address, buyUsingToken, isOpen, setIsOpen, priceInToken, currentTokenName, handleBuyUsingTokenSubmit, closeModal }}>
      {props.children}
    </AppContext.Provider>
  )
}

export const ContextState = () => {      //Used in every file where state is used
  return useContext(AppContext);
}

export default PaymentContext;          //Used in index to wrap the <App />