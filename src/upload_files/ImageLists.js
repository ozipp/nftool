import React, { useState, useReducer, useEffect} from "react";
import "./styles.css";
import {SimplePostRequest, BlobPostRequest} from './../common_item/SupportFunctions'
import {Card, CardActions, CardContent, Button, Typography, Box, CardActionArea } from '@mui/material';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import JsonPanel from './JsonPanel';

export default function ImageLists(props) {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  //const [myData, setMyData] = useState([]);

  // form submission and data addition

  // delete items

  function addDataImages(data){
    if (data.Entries!= null){

      for (let i = 0; i < data.Entries.length; i++) {
        BlobPostRequest('/api/v1/files/read?arg=/' + props.state + '/' + props.layer + '/' + props.selectedTab + '/' + data.Entries[i].Name, pushDataImages, empty_err)
      }
    }
}

function pushDataImages(data){
  
  console.log("url_url");
  const url = URL.createObjectURL(data);
  
   console.log(url);
  console.log("url2_url2");
   props.myData.push(url)
   forceUpdate();
}
useEffect(() => {
  console.log("prog update2")
  // call the function
 // fetchData().catch(console.error);
}, [])

const fetchData = async () => {

  //setTabs(tabs =>[])
  if (props.myData.length === 0)
    getImages();
 
 // getProjects();
}

function empty_err(){

}

function getImages(){
    SimplePostRequest('/api/v1/files/ls?arg=/' + props.state + '/' + props.layer + '/' + props.selectedTab, addDataImages, empty_err)
}

  const onDelete = (myId, each) => {
    const updates = props.myData.filter((each, idx) => idx !== myId);
   // props.myData.splice(0,props.myData.length)
    console.log("onDelete " + updates);
    console.log(props.myData[myId]);
    props.deleteImage(each.name, props.selectedTab)
    for (let i = 0; i < updates.length; i++) {
       if (props.myData[i] != updates[i]){
          props.myData.splice(i, 1);
          break;
       }
       if (i + 1 == updates.length &&  updates.length < props.myData.length){
          props.myData.splice(i+1, 1);
       }
    }
    if (updates.length == 0){
      props.myData.splice(0, 1);
    }
    
    forceUpdate();
    };

  const onChangeTerm = (e) => {
    console.log(e.target.files[0]);
    for (let i = 0; i < e.target.files.length; i++){
      let url = URL.createObjectURL(e.target.files[i]);
      props.myData.push({url: url, name: e.target.files[i].name, part_name: e.target.files[i].name, part_describe: "", rarity: "common"});
      console.log(props.myData);
      console.log("upload file");
      let file = e.target.files[i];
      props.uploadFile(file, props.selectedTab)
      
    }
    forceUpdate();
  };

  const rarityChange = (e, idx, each) =>{
    console.log("rarityChange")
    each.rarity = e.target.value;
    console.log(e)
    forceUpdate();
  }

  const nameChange = (e, idx, each) =>{
    console.log("nameChange")
    each.part_name = e.target.value;
    console.log(e)
    forceUpdate();
  }

  return (
    <div style={{"display": "flex", "flexWrap": "wrap"}}>
      <Card sx={{ minWidth: 275, mr:2, mb:2}} >
        <CardActionArea>
          <CardContent style={{"display": "flex", "flexDirection": "column"}}>
            <NoteAddOutlinedIcon sx={{ width: 250,  height:321, mt:2}}/>
            <Button variant="contained" component="label"> Upload Images
                <input type="file" multiple onChange={onChangeTerm} hidden/>
            </Button>
          </CardContent>
          </CardActionArea>
      </Card>
      <div style={{"display": "flex", "flexWrap": "wrap"}}>
        {props.myData.map((each, idx) => (
          <div key={idx}>
             <Card sx={{ minWidth: 275, mr:2, mb:2}} >
                <CardContent style={{"display": "flex", "flexDirection": "column"}}>
                  <div style={{"display": "flex", "flexDirection": "column"}}>
                    <JsonPanel rarity={each.rarity} rarityChange={(e) => rarityChange(e, idx, each)} part_name={each.part_name} partNameChange={(e) => nameChange(e, idx, each)} part_describe={each.part_describe}/>
                    <img src={each.url} alt="Logo" width="250" height="250" style={{"boxShadow": "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"}} />
                    
                  </div>
                  <Button sx={{ mt:2, backgroundColor: "#3DD1E7", color: "black"}} variant="contained" onClick={() => onDelete(idx, each)}>remove</Button>
                </CardContent>
              </Card>
           
          </div>
        )
        )}
      </div>
    </div>
  );
};