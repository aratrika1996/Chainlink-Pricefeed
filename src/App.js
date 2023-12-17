import {useState, useEffect} from 'react'
import { ethers } from "ethers";

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loader from "./components/Loader";

import priceFeeds from './constants/constant';
import {contractAddress, abi} from "./constants/contract"


function App() {
  const [contractProvider, setContractProvider] = useState(null);
  const [contractSigner, setContractSigner] = useState(null);

  const [selectedOption, setSelectedOption] = useState({
    name: '',
    value: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false)
  
  const [price, setPrice] = useState(0);
  const [cryptoPair, setCryptoPair] = useState({
    crypto: "",
    fiat: ""
  })
  

  const handleOptionChange = (e) => {
    setSelectedOption({
      name: e.target.name,
      value: e.target.value
    });
  };

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        try {
          
          // Initialize ethers provider using MetaMask provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contractProvider = new ethers.Contract(contractAddress, abi, provider);
          setContractProvider(contractProvider);
          
          const signer = await provider.getSigner()
          const contractSigner = new ethers.Contract(contractAddress, abi, signer);
          setContractSigner(contractSigner)

        } catch (error) {
          console.error(error);
        }
        
      }
      
    }

    init();
  }, []);

  const getPriceConversion = async() => {
    try {

      setIsLoading(true); 
      
      if(contractSigner) {
        const transaction = await contractSigner.getChainlinkDataFeedLatestAnswer(selectedOption.value);
        await transaction.wait();
      }
      
      let price = await contractProvider.readPrice()
      if (selectedOption.name === 'BTC/ETH') {
        price = ethers.formatUnits(price, 18)
      }
      else {
        price = ethers.formatUnits(price, 8)
      }
      
      // const decimalNumber = (Number(price) / 100000000).toFixed(2);
      price = Number(price).toFixed(2)
      setPrice(price)

      const [crypto, fiat] = selectedOption.name.split("/")
      setCryptoPair({
        crypto: crypto,
        fiat: fiat
      })
      setShowResult(true)
      
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    
  }

  return (
    <div className="App">
      <h1 className='mb-3'>Chainlink Pair Conversions</h1>
      <Form>
      {priceFeeds.map((priceFeed) => (
        <div key={priceFeed.id} className="mb-3">
          <Form.Check
            type="radio"
            id={priceFeed.id}
            label={priceFeed.label}
            name={priceFeed.label}
            value={priceFeed.value}
            checked={selectedOption.value === priceFeed.value}
            onChange={handleOptionChange}
          />
        </div>
      ))}
    </Form>
    <Button variant="primary" onClick={getPriceConversion}>Submit</Button>
    {showResult && <p className='mt-3'>1 {cryptoPair.crypto} = {price} {cryptoPair.fiat}</p>}
    {isLoading && <Loader />}
    </div>
  );
}

export default App;
