import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import  {ContextState}  from '../Context/AppContext';

import { Card } from 'react-bootstrap';

function Home() {
  const { getProviderOrSigner,  connectWallet, walletConnected } = ContextState()

  getProviderOrSigner();
  useEffect(() => {
    if (!walletConnected) {
      connectWallet();
    }
  }, [walletConnected])


  return (
    <div className="App">
      <div className='home-body container-fluid'>
        <div className='products'>
          <Card className='product-card'>
            <Card.Img variant="top" src="./sneaker.jpeg" alt='Sneaker Image' />
            <Card.Body>
              <Card.Title>Bifua Sneaker</Card.Title>
              <Card.Text><b>Price</b> : $15</Card.Text>

              {/* Here we can Acheive Functionality that we can use Different Chains */}
                  {/* But I have commented this out just to keep it simple */}

              {/* <Link to={`/payment/${'BNB'}`}><button className="chain-btn" onClick={() => buyUsingEther("0x38")}>BNB(M)</button></Link>
              <Link to={`/payment/${'BNB'}`}><button className="chain-btn" onClick={() => buyUsingEther("0x61")}>BNB(T)</button></Link>
              <Link to={`/payment/${'ETH'}`}><button className="chain-btn" onClick={() => buyUsingEther("0x1")}>ETH (MAIN)</button></Link> */}
              <Link to={`/payment/${'ETH'}`}><button className="chain-btn" >Buy</button></Link> 
              {/* <button className="chain-btn" onClick={() => buyUsingEther("0x5")}>Goerli</button> */}
            </Card.Body>
          </Card>
          <Card className='product-card'>
            <Card.Img variant="top" src="./tourBag.jpeg" alt='Bag Image' />
            <Card.Body>
              <Card.Title>Miura Tour Bag</Card.Title>
              <Card.Text><b>Price</b> : $24</Card.Text>
              <Link to={`/payment/${'ETH'}`}><button className="chain-btn" >Buy</button></Link> 
            </Card.Body>
          </Card>
          <Card className='product-card'>
            <Card.Img variant="top" src="./camera.jpeg"  alt='Camer Image' />
            <Card.Body>
              <Card.Title>Zenfolio</Card.Title>
              <Card.Text><b>Price</b> : $150</Card.Text>
              <Link to={`/payment/${'ETH'}`}><button className="chain-btn" >Buy</button></Link>
            </Card.Body>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default Home
