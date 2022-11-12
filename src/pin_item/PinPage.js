import { useNavigate  } from 'react-router-dom'
import { useLocation  } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import {SimplePostRequest, SimplePostWithRequest} from '../common_item/SupportFunctions'
import HorizontalNonLinearStepper from '../HorizontalNonLinearStepper'
import {Card, CardActions, CardContent, Button, Typography, Box, CardActionArea, Select, MenuItem, InputLabel,TextField } from '@mui/material';
import './../common_item/Background.css'

function PinPage() {
    const { state } = useLocation();
    const cookies = new Cookies();
    const [path, setPath] = useState("http://127.0.0.1:5001");
    const [NFTContent, setNFTContent] = useState("");
    const [NFTMetadata, setNFTMetadata] = useState("");


    useEffect(() => {
            fetchData().catch(console.error);
      }, [])

    const fetchData = async () => {
        getStatusJsons();
        getStatusImages();
    }

    function empty_err(){

    }

    function empty(data){

    }

    function getStatusJsons(){
        SimplePostWithRequest('/api/v1/files/stat?arg=/'  + state + '/' + "jsons", uploadJsonFile, empty_err)
    }

    function getStatusImages(){
        SimplePostWithRequest('/api/v1/files/stat?arg=/'  + state + '/' + "images", uploadImageFile, empty_err)
    }

    function uploadJsonFile(data){
        setNFTMetadata(data.Hash)
        
        SimplePostRequest('/api/v1/pin/add?arg=' + data.Hash +'&recursive=1', empty, empty_err)
        SimplePostRequest('/api/v1/storage/upload?arg=' + data.Hash, empty, empty_err)
    }

    function uploadImageFile(data){
        setNFTContent(data.Hash)
        SimplePostRequest('/api/v1/pin/add?arg=' + data.Hash +'&recursive=1', empty, empty_err)
        SimplePostRequest('/api/v1/storage/upload?arg=' + data.Hash, empty, empty_err)
    }

      
    return (
        <div className="main-image">
            <HorizontalNonLinearStepper step={4} state={state}/>
            <div className="common-div">
                <h1>All done! Congratulations!</h1>
                    <div style={ {'display': 'inline-block'}}>
                        <h2>NFT Content</h2>
                        <div style={{"display": "flex", "flexDirection": "row"}}>
                            <TextField id="outlined-basic"  sx={{width: "600px", background: "white"}} variant="outlined" value={NFTContent} inputProps={{ readOnly: true, }}/>
                            <Button sx={{ ml:1, backgroundColor: "#3DD1E7", color: "black"}} variant="contained" onClick={() => {navigator.clipboard.writeText(NFTContent)}}>Copy</Button>
                        </div>
                    </div>
                <div style={ {'display': 'inline-block'}}>
                    <h2>NFT Metadata</h2>
                    <div style={{"display": "flex", "flexDirection": "row"}}>
                        <TextField id="outlined-basic"  sx={{width: "600px", background: "white"}} variant="outlined" value={NFTMetadata} inputProps={{ readOnly: true, }}/>
                        <Button sx={{ ml:1, backgroundColor: "#3DD1E7", color: "black"}} variant="contained" onClick={() => {navigator.clipboard.writeText(NFTMetadata)}}>Copy</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PinPage;