import './App.css';
import Web3 from 'web3';
import React, {useState, useEffect} from 'react';

function App() {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState('');

  useEffect(()=>{
    if(typeof window.ethereum != "undefined"){
      try{
        const web = new Web3(window.ethereum);
        setWeb3(web);
      }catch(err){
        console.log(err);
      }
    }
  },[]);

// 메타마스크로부터 계정을 연결 && 계정 주소를 상태로 저장
  const connectWallet = async () =>{ 
    const accounts = await window.ethereum.request({ // 메타마스크 지갑과 연결된 계정 정보를 받는 JSON-RPC Call API
      method: "eth_requestAccounts",
    })
    setAccount(accounts[0]);
  }

  return (
    <div className="App">
      <button
      className = "metaConnect"
      onClick={()=>{
        connectWallet();
      }}>
        Connect Wallet
      </button>
      <div className='userInfo'>주소: {account}</div>
    </div>
  );
}

export default App;
