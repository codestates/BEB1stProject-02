import React, {useState} from 'react';
import erc721Abi from '../erc721Abi';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import AppBar from '@mui/material/AppBar';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';

function Erc721({newErc721addr, web3, account, erc721list}){
    const [to, setTo] = useState('');
    const [pressSend, setPressSend] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendToken = async (tokenId) =>{
        console.log(`newErc721addr: ${newErc721addr}`);
        setLoading(true);
        const tokenContract = await new web3.eth.Contract(erc721Abi, newErc721addr, {from: account});
        console.log(tokenId);
        tokenContract.methods
        .transferFrom(account, to, tokenId)
        .send({from: account})
        .on("receipt", (receipt)=>{
            setTo("");
            setLoading(false);
            setPressSend(true);
        })
    }
    return(
        <div className="erc721list">
            {erc721list.map((token)=>{
                return (
                    <Container component="main" maxWidth="sm">
                        <div>
                            <Button variant="text" size='large'>
                                {`${token.tokenId}: ${token.name}(${token.symbol})`}
                            </Button>
                        </div>
                        <img src={token.tokenURI} width={300} />
                        {pressSend ?
                            <Alert severity="success" sx={{ mt: 2, mb: 2 }}> Send token successfully — check it out!</Alert> :
                            <Input
                                required
                                id="To Address"
                                label="To Address"
                                variant="standard"
                                sx={{ mt: 2, mb: 5 }}
                                onChange={(event) => { setTo(event.target.value) }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <LoadingButton
                                            endIcon={<SendIcon />}
                                            onClick={
                                                sendToken.bind(this, token.tokenId)
                                            }
                                            loading={loading}
                                            loadingPosition="end"
                                        >
                                            Send
                                        </LoadingButton>
                                    </InputAdornment>}
                            />}
                    </Container>
                );
            })}
        </div>
    )
}
export default Erc721;