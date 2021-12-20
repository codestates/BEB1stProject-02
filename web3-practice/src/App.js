import './App.css';
import Web3 from 'web3';
import React, {useState, useEffect} from 'react';
import erc721Abi from './erc721Abi';
import TokenList from './component/TokenList.js';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';



function App() {
  const [web3, setWeb3] = useState();
  const [account, setAccount] = useState('');
  const [newErc721addr, setNewErc721addr] = useState();
  const [erc721list, setErc721list] = useState([]);
  const [pressBtn, setPressBtn] = useState(false);
  const [pressStart, setPressStart] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const addNewErc721Token = async() =>{
    setLoading(true);
    setPressBtn(true);
    const tokenContract = await new web3.eth.Contract(erc721Abi, newErc721addr); // 컨트랙트의 ABI와 주소로 *컨트랙트 객체 생성*
    console.log(tokenContract);
    console.log(erc721Abi);

    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const totalSupply = await tokenContract.methods.totalSupply().call();

    let arr = [];
    for(let i = 1; i <= totalSupply; i++){
      arr.push(i);
    }

    for(let tokenId of arr){
      const tokenOwner = await tokenContract.methods.ownerOf(tokenId).call();

      if(String(tokenOwner).toLowerCase() === account){
        const tokenURI = await tokenContract.methods.tokenURI(tokenId).call();
        setErc721list((prev)=>{
          return [...prev, {name, symbol, tokenId, tokenURI}];
        })
      }
    }
    setLoading(false);
  }


  return (
    <div className="App">
      <Container component="main" maxWidth="sm">
        <Button
          color="primary"
          fullWidth
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          startIcon={<LocalAtmTwoToneIcon/>}
          onClick={()=>{
            connectWallet();
            setPressStart(true);
          }}
        >
          {pressStart ? account : "Connect Wallet"}
        </Button>
            <TextField
              fullWidth
              required
              id="Contract Address"
              label="Contract Address"
              onChange={(event)=>{setNewErc721addr(event.target.value)}}
            />
        <LoadingButton loading={loading} variant="contained" sx={{mt:2, mb: 4}} onClick={addNewErc721Token}>add new ERC721</LoadingButton>
      <TokenList newErc721addr={newErc721addr} web3={web3} account ={account} erc721list={erc721list}/>
      </Container>
    </div>
  );
}

export default App;
