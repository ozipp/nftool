import React, { useState, useReducer, useEffect} from "react";
import { useLocation  } from 'react-router-dom'
import { useNavigate  } from 'react-router-dom'
import "./styles.css";
import {SimplePostRequest, BlobPostRequest} from './../common_item/SupportFunctions'
import {Card, CardActions, CardContent, Button, Typography, Box } from '@mui/material';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import HorizontalNonLinearStepper from './../HorizontalNonLinearStepper'
import './../common_item/Background.css'

export default function FinalImageCollection() {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const { state } = useLocation();
  const [myData, setMyData] = useState([])
  const navigate = useNavigate();
  const images = "images"
  const jsons = "jsons"
  
  let init =  "";
  

  function addDataImages(data){
    if (data.Entries!= null){

      for (let i = 0; i < data.Entries.length; i++) {
        BlobPostRequest('/api/v1/files/read?arg=/' + state + '/' + images + '/' + data.Entries[i].Name, pushDataImages, empty_err, data.Entries[i].Name)
      }
    }
    
   
}

function pushDataImages(data, name){
  
  console.log("url_url");
  const url = URL.createObjectURL(data);

  setMyData(myData => [...myData, {url: url, name: name}])
  
   console.log(url);
  console.log("url2_url2");
  // props.myData.push(url)
   //forceUpdate();
}
useEffect(() => {
  console.log("prog update2")
  // call the function
  if (init.length ===0){
    init = "21";
    fetchData().catch(console.error);
  }

  //fetchData().catch(console.error);
}, [setMyData])

const fetchData = async () => {

  //setTabs(tabs =>[])
  //if (myData.length === 0)
    getImages();
 
 // getProjects();
}

function empty(data){

}

function empty_err(){

}

function getImages(){
    SimplePostRequest('/api/v1/files/ls?arg=/' + state + '/' + images, addDataImages, empty_err)
}

function deleteImage(name){
  SimplePostRequest('/api/v1/files/rm?arg=/'+ state + '/' + images + '/' +  name, empty, empty_err)
}

function deleteJson(name){
  SimplePostRequest('/api/v1/files/rm?arg=/'+ state + '/' + jsons + '/' +  name, empty, empty_err)
}

  const onDelete = (myId, each) => {

    const updates = myData.filter((each, idx) => idx !== myId);

    setMyData(updates);
    deleteImage(each.name)
    deleteJson(each.name.replace('.png', '.json'))
  };

  const onChangeTerm = () => {
    navigate('/current_project_page', {state: state})
    //forceUpdate();
  };

  const onPinImages = () => {
    navigate('/pin_page', {state: state})
    //forceUpdate();
  };

  return (
    <div className="main-image">
      <HorizontalNonLinearStepper step={3} state={state}/>
      <Button variant="contained" component="label" sx={{mt:2, mb:2}} onClick={onPinImages}>Pin and upload Images</Button>
      <div style={{"display": "flex", "flexDirection": "row" }}>
        
        <div style={{"display": "flex", "flexWrap": "wrap"}}>
          <Card sx={{ minWidth: 275, mr:2, mb:2}} >
            <CardContent style={{"display": "flex", "flexDirection": "column", "flexWrap": "wrap"}}>
              <NoteAddOutlinedIcon sx={{ width: 250,  height:250, mt:2}}/>
              <Button variant="contained" component="label" onClick={onChangeTerm}>Generate more images</Button>
            </CardContent>
          </Card>
          {myData.map((each, idx) => (
            <div key={idx}>
              <Card sx={{ minWidth: 275, mr:2, mb:2}} >
                  <CardContent style={{"display": "flex", "flexDirection": "column"}}>
                    <img src={each.url} alt="Logo" width="250" height="250" style={{"boxShadow": "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"}} />
                    <Button sx={{ mt:2, backgroundColor: "#3DD1E7", color: "black"}} variant="contained" onClick={() => onDelete(idx, each)}>remove</Button>
                  </CardContent>
                </Card>
            
            </div>
          )
          )}
        </div>
      </div>
    </div>
  );
};