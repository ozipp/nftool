import React, { useState, useReducer, useEffect} from "react";
import {SimplePostRequest, BlobPostRequest} from './../common_item/SupportFunctions'

export default function CollectionList(props) {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function addDataImages(data){
    if (data.Entries!= null){

      for (let i = 0; i < data.Entries.length; i++) {
        BlobPostRequest('/api/v1/files/read?arg=/' + props.state + '/' + props.layer + '/' + props.selectedTab + '/' + data.Entries[i].Name, pushDataImages, empty_err)
         // console.log("data image");
         // console.log(data);
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
  fetchData().catch(console.error);
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

  const onDelete = (myId) => {
    const updates = props.myData.filter((each, idx) => idx !== myId);
   // props.myData.splice(0,props.myData.length)
    console.log("onDelete " + updates);

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
      props.myData.push(url);
      console.log("upload file");
      props.uploadFile(e.target.files[i], props.selectedTab, props.tabs)
      
    }
    forceUpdate();
   // setTerm(URL.createObjectURL(e.target.files[0]))
  };



  return (
    <div style={{"display": "flex", "flexWrap": "wrap"}}>
      <input type="file" multiple onChange={onChangeTerm} />
      <div style={{"display": "flex", "flexWrap": "wrap"}}>
        {props.myData.map((each, idx) => (
          <div key={idx}>
            <img src={each} alt="Logo" width="250" height="250" />
            <button onClick={() => onDelete(idx)}>remove</button>
          </div>
        )
        )}
      </div>
    </div>
  );
};