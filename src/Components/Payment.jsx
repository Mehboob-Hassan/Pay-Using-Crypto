import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { providers, utils } from 'ethers'
import Web3Modal from "web3modal";
import Modal from 'react-modal';
import { Card } from 'react-bootstrap';
import '../App.css'
import { ContextState } from '../Context/AppContext';


// Dumy price
const price = 15;




function Payment() {
    const [priceInEther, setPriceInEther] = useState();
    const { buyUsingToken, isOpen, priceInToken, currentTokenName, handleBuyUsingTokenSubmit, closeModal } = ContextState()



    const params = useParams();
    const chain = params.param;
    let priceAPI;


    // BUY USING BNB
    const buyUsingNativeCurrency = async () => {
        // Get price converted to BNB by Using API
        priceAPI = `https://min-api.cryptocompare.com/data/price?fsym=${chain}&tsyms=${chain},USD`;
        let oneUSD;
        await axios.get(priceAPI)
            .then((data) => {
                const dollar = data.data.USD;
                oneUSD = (1 / dollar);
                console.log(oneUSD)
                setPriceInEther(price * oneUSD);
            }).catch((err) => {
                console.log(err);
            })
    }

    //  GET PROVIDER OR SIGNER
    //=========CONNECT WALLET====
    const getProviderOrSigner = async (needSigner = false) => {
        try {
            const web3Modal = new Web3Modal();
            const web3Provider = await web3Modal.connect();
            const provider = new providers.Web3Provider(web3Provider);
            const signer = provider.getSigner();

            const address = await signer.getAddress();
            console.log(address);
            if (needSigner) {
                return signer;
            }
            return provider;
        } catch (error) {
            console.log(error.message)
        }
    }


    //  PAY ETHER
    const payEther = async () => {
        const signer = await getProviderOrSigner(true);
        const _to = "0x4c2BA22D31d59855FFC0eda1fBfdEdD610CDb730";
        const stringPrice = priceInEther.toString();
        const amount = utils.parseEther(stringPrice);
        console.log(amount);
        try {
            const tx_params = {
                to: _to,
                value: amount.toString(),
            }
            console.log(tx_params);
            const tx = await signer.sendTransaction(tx_params);

            console.log(tx);
        } catch (error) {
            console.log(error.message)
        }
    }





    useEffect(() => {
        buyUsingNativeCurrency();
    }, [])
    { priceInEther && console.log((priceInEther)); }

    return (
        <div className='payment-body'>
            <div className='payment-body-cards'>
                <Card className='payment-card'>
                    <Card.Body>
                        <Card.Title>Payment Method</Card.Title>
                        <Card.Text>{priceInEther} BNB</Card.Text>
                        <Card.Text><b>Price</b> : ${price}</Card.Text>
                        <button className="payUsingMetamskBtn" onClick={payEther}>Pay Using Metamask</button>
                    </Card.Body>
                    <Card.Body >
                        <Card.Title><b>Pay Using</b></Card.Title>
                        <div className='token-Buttons'>
                            <div>
                                <button onClick={() => buyUsingToken('DOGE', price)}><img src='../dogecoin.jpeg' alt='Image Here'/> DOGE</button><br />
                                <button onClick={() => buyUsingToken('USDC', price)}><img src='../usdc.png' alt='Image Here'/> USDC</button><br />
                                <button onClick={() => buyUsingToken('LTC', price)}><img src='../litecoin.png' alt='Image Here'/> LiteCoin </button>
                            </div>
                            <div>
                                <button onClick={() => buyUsingToken('SHIB', price)}><img src='../shiba.png' alt='Image Here'/> Shiba</button><br />
                                <button onClick={() => buyUsingToken('DAI', price)}><img src='../dai.png' alt='Image Here'/> DAI</button><br />
                                <button onClick={() => buyUsingToken('APE', price)}><img src='../apecoin.png' alt='Image Here'/> Apecoin</button>
                            </div>

                        </div>
                    </Card.Body>
                </Card>

            </div>

            {/* =========MODEL FOR PAYMENT========== */}
            <Modal className='tokenPaymentModel' isOpen={isOpen} onRequestClose={closeModal}>
                <h1>Pay Using {currentTokenName}</h1>
                <h3>{priceInToken}</h3>
                <br />
                <div className='subCancelBtn'>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={handleBuyUsingTokenSubmit}>Buy</button>
                </div>
            </Modal>

        </div>
    )
}

export default Payment