import React from 'react';
import '../App.css';
import { ContextState } from '../Context/AppContext';

function Header() {
  const { address, connectWallet } = ContextState();


  // SHORTEN ADDRESS FOR BUTTON
  const shortenAdress = (address)=>{
    const start = address.slice(0,5);
    const end = address.slice(-5);
    return start+'...'+end;
  }

  connectWallet();



  // ============================
  const buttonComponent = ()=>{
    if(address === undefined ){
      return <button onClick={connectWallet}>Connect</button>
    }else{
      return <button>{shortenAdress(address)}</button>
    }
  }
  // ============================
  return (
    <div className='Header'>
      <div className='left'>
        <img src="mh.png" alt="Logo" />
        <h2>Crypto Payment App</h2>
      </div>
        <div className='right'>
            {buttonComponent()}
        </div>
    </div>
  )
}

export default Header
