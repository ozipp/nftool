import React, { useState, useEffect, useReducer } from 'react';
import { json, useNavigate  } from 'react-router-dom'
import axios from 'axios';
import { useLocation  } from 'react-router-dom'
import {
    Tab, Grid, Button, TextField, Card, CardContent, MenuItem
} from '@mui/material';
import {
    TabList,
    TabContext, TabPanel
} from '@mui/lab';
import ImageList from './ImageLists';
import CloseIcon from '@mui/icons-material/Close';
import mergeImages from 'merge-images';
import DialogCreateName from '../Dialog/DialogCreateName';
import {SimplePostRequest, BlobPostRequest, SimplePostWithRequest, DataPostRequest, DataPostRequestWithParam} from '../common_item/SupportFunctions'
import './../common_item/Background.css'
import HorizontalNonLinearStepper from './../HorizontalNonLinearStepper'

export default  function LayersList() {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const images = "images"
    const layer = "layers"
    const jsons = "jsons"
    const navigate = useNavigate();
    let currentImage = "";
    const [selectedTab, setSelectedTab] = useState("All")
    const { state } = useLocation();

    const [tabs, setTabs] = useState([])
    const [openDialog, setOpenDialog] = React.useState(false);
  //  const [testSuperImg, setTestSuperImg] = useState("")

    const [countImages, setCountImages] = useState(50)
    const [panels, setPanels] = useState([])
    const [tabIndex, setTabIndex] = useState(2)

    const handleChange = (event, newValue) => {
        console.log("tab change")
        console.log(newValue)
        setSelectedTab(newValue);
    };

    function empty(data){

    }

    function empty_err(){

    }

    function createProjectDirectory(){

        SimplePostRequest('/api/v1/files/mkdir?arg=/'+ state + '/' + layer, empty, empty_err)
    }


    function createLayerDirectory(name){
        SimplePostRequest('/api/v1/files/mkdir?arg=/'+ state + '/' + layer + '/' + name, empty, empty_err)
    }


    function createImageDirectory(){
        SimplePostRequest('/api/v1/files/mkdir?arg=/'+ state + '/' + images, empty, empty_err)
    }

    function createJSONDirectory(){
        SimplePostRequest('/api/v1/files/mkdir?arg=/'+ state + '/' + jsons, empty, empty_err)
    }

    function deleteImage(name, selectedTab1){
        SimplePostRequest('/api/v1/files/rm?arg=/'+ state + '/' + layer + '/' + selectedTab1  + '/' +  name, empty, empty_err)
    }

    function uploadFile(name, selectedTab1){
        console.log("tab n" + name);
        const data = new FormData();
        data.append('file', name);
        DataPostRequest('/api/v1/files/write?arg=/' + state + '/' + layer + '/' + selectedTab1 + '/' + name.name +'&create=1', data, empty, empty_err)
    }

    function uploadImageFile(fileData, name, obj){
        console.log("tab n" + fileData);
        const data = new FormData();
        data.append('file', fileData);
        DataPostRequestWithParam('/api/v1/files/write?arg=/' + state + '/' + images + '/' + name +'.png' +'&create=1', data, getFileHash, empty_err, name, obj)
    }

    function getFileHash(fileData,name, obj){
        console.log("getFileHash");
        SimplePostWithRequest('/api/v1/files/stat?arg=/'  + state + '/' + images + '/' + name +'.png', uploadJsonFile, empty_err, obj, name)
    }
    
    function uploadJsonFile(fileData, obj, name){
        obj.image = "https://gateway.btfs.io/btfs/" + fileData.Hash
        const data = new FormData();
        data.append('file', JSON.stringify(obj));
        DataPostRequest('/api/v1/files/write?arg=/' + state + '/' + jsons + '/' + name +'.json' +'&create=1', data, empty, empty_err)

        //console.log("uploadJsonFile");
      //  console.log("tab n11 " + fileData.Hash);
    }

    function getLayers(data){
      //  console.log(data.Entries);
            if (data.Entries!= null){
                let dataArr = [];
                for (let i = 0; i < data.Entries.length; i++) {
                   // if (tabs.length < tabIndex + i)
                   let tab1 = createOneTab(data.Entries[i].Name, tabIndex + i)
                   getImages(tab1.title, tab1)
                   dataArr.push(tab1); 
                   //getImages(data.Entries[i].Name);
                    //console.log("makeLayer " + dataArr);
                }
                setTabs(dataArr)
                console.log("tabs")
                console.log(tabs)
                setTabIndex(tabIndex => tabIndex + data.Entries.length)
                console.log(tabIndex)
                
            }
           // setSelectedTab('All')
            forceUpdate()
    }


    const fetchData = async () => {

        //setTabs(tabs =>[])
        SimplePostRequest('/api/v1/files/ls?arg=/' + state+ '/' + layer, getLayers, createProjectDirectory)
        createImageDirectory()
        createJSONDirectory()

       
       // getProjects();
    }
    useEffect(() => {
        console.log("prog update")
        // call the function
        fetchData().catch(console.error);
    }, [setTabs, setTabIndex, setSelectedTab])

    

    const handleTabOptions = (value) => {
        setSelectedTab(value)
        setTabIndex(tabIndex => tabIndex + 1)
    }

    function getImages(title, tab1){

        SimplePostWithRequest('/api/v1/files/ls?arg=/' + state + '/' + layer + '/' + title, addDataImages, empty_err, title, tab1)
    }

    function addDataImages(data, value1, tab1){
        console.log("value1")
        console.log(value1)
        if (data.Entries!= null){
    
          for (let i = 0; i < data.Entries.length; i++) {
            BlobPostRequest('/api/v1/files/read?arg=/' + state + '/' + layer + '/' + value1 + '/' + data.Entries[i].Name, pushDataImages, empty_err, data.Entries[i].Name, tab1)
             // console.log("data image");
             // console.log(data);
          }
        }
    }

    async function pushDataImages(data, value1, tab1){
  
        console.log("url_url");
        const buffer = await data.arrayBuffer();
       /* const metadata = readMetadata(buffer);
        console.log(metadata);*/
        const url = URL.createObjectURL(data);
        
         console.log(url);
        console.log("url2_url2");
       // const tabArr = tabs.filter(x => x.value === value1)
        console.log(tab1);
        tab1.images.push({url: url, name: value1, part_name: value1, part_describe: "", rarity: "common"})

        console.log(tab1.images);
        console.log("url3_url3");
        // forceUpdate();
    }
    


    function createOneTab(title, tabI){
        //const value = title
        currentImage = title;
        

        let myData = [];////useState([]);
        //const setMyData = [];
        
       
        const newTab = {
            value: title,
            title: title,
            images: myData,
            child: () => <ImageList myData={newTab.images} state={state} layer={layer} uploadFile={uploadFile} selectedTab={title} deleteImage={deleteImage}/>
        }
        return newTab;

    }

    function makeLayer(title){
        console.log(tabIndex)
        const newTab = createOneTab(title, tabIndex);
        setTabs(tabs => [...tabs, newTab])
        handleTabOptions(newTab.value);
    }

    function createLayer(title) {
        createLayerDirectory(title)
        makeLayer(title, tabIndex)
    }


    const handleTabClose = (event, value) => {
        //tabs.map(e => console.log(e.value))
        //console.log(tabs)
        //console.log(value)
        const tabArr = tabs.filter(x => x.value !== value)

        //console.log(tabArr)
        setTabs(tabArr)
        SimplePostRequest('/api/v1/files/rm?arg=/'+ state + '/' + layer + '/' + value+ '&recursive=1', empty, empty_err)

        // const panelArr = panels.filter(p => p.value !== value)
        // setPanels(panelArr);

        setSelectedTab('All')
    }

    function DataURIToBlob(dataURI) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
      }


    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createImagesClick (){

        for (let j = 0; j < countImages; j++){
            const parts = [];
            var obj = new Object();
            obj.name = state.split("/")[1] + j ;
            var attributes = [];

            for (let i = 0; i < tabs.length; i++){
                if (tabs[i].images.length > 0){
                    let randInt = getRandomInt(1, 100)
                    if (randInt === 1){
                        const updates = tabs[i].images.filter((each, idx1) => each.rarity === "mythic");
                        if (updates.length > 0){
                            let randInt1 = getRandomInt(0, updates.length-1)
                            attributes.push({value : tabs[i].images[randInt1].part_name, type: tabs[i].title})
                            parts.push(tabs[i].images[randInt1].url)
                            continue
                        }
                    }
                    if (randInt < 20){
                        const updates = tabs[i].images.filter((each, idx1) => each.rarity === "legendary");
                        if (updates.length > 0){
                            let randInt1 = getRandomInt(0, updates.length-1)
                            attributes.push({value : tabs[i].images[randInt1].part_name, type: tabs[i].title})
                            parts.push(tabs[i].images[randInt1].url)
                            continue
                        }
                    }

                    if (randInt < 35){
                        const updates = tabs[i].images.filter((each, idx1) => each.rarity === "rare");
                        if (updates.length > 0){ 
                            let randInt1 = getRandomInt(0, updates.length-1)
                            attributes.push({value : tabs[i].images[randInt1].part_name, type: tabs[i].title})
                            parts.push(tabs[i].images[randInt1].url)
                            continue
                        }
                    }
                    let randInt1 = getRandomInt(0, tabs[i].images.length-1)
                    attributes.push({value : tabs[i].images[randInt1].part_name, type: tabs[i].title})
                    parts.push(tabs[i].images[randInt1].url)

                    //parts.push(tabs[i].images[0].url)
                }
            }
            obj.attributes = attributes
            console.log(parts);
            

            var jsonString= JSON.stringify(obj);
            console.log(jsonString)
            mergeImages(parts)
            
                .then(b64 => {
                    console.log(b64)
                    console.log(DataURIToBlob(b64))
                    let dateTimeName = new Date().getTime()
                    //console.log();
                    uploadImageFile(DataURIToBlob(b64), dateTimeName, obj)
                });
            }

            navigate('/final_page', {state: state}/*{path: projectPath+'/'+name}*/);
        }
           
            

      /*  var filler = 100 - rarities.map(r => r.chance).reduce((sum, current) => sum + current);
        var probability = rarities.map((r, i) => Array(r.chance === 0 ? filler : r.chance).fill(i)).reduce((c, v) => c.concat(v), []);

        // Pick one
        var pIndex = Math.floor(Math.random() * 100);
        console.log(pIndex)
        console.log(filler)
        console.log(probability)*/

       // 

   // }

    const changeCountImage = (event) => {
        console.log("count change")
        console.log(event.target.value)
        setCountImages(event.target.value);
    };

    function showLayerDlg(){
       // console.log(state)
        console.log("showLayerDlg");
        setOpenDialog(true);
    }

    const removeItemFromAllTab= (index, idx, tab) =>{

        deleteImage(tab.images[idx].name, tab.title)
        const updates = tab.images.filter((each, idx1) => idx1 !== idx);
        tabs[index].images = updates;
        setTabs(tabs)
        forceUpdate()

    }
    return (
        <div className="main-image">
            <HorizontalNonLinearStepper step={2} state={state}/>
             <Card sx={{ minWidth: 275, mr:2, mb:2}} >
                <CardContent style={{"display": "flex", "flexDirection": "row", "justifyContent":"center"}}>
                    
                    <div style={{"display": "flex", "flexDirection": "row", "justifyContent":"center"}}>
                        <h4 style={{"marginRight": "20px"}}>Collection Size</h4>
                        <TextField id="outlined-number"                         
                                    type="number"
                                    value={countImages}
                                    onChange={changeCountImage}
                                    inputProps={{
                                        shrink: true,
                                        min: 1,
                                        max: 10000,
                                        step: 50
                                    }}
                                />
                        <Button variant="contained" sx={{ mr:2, ml:3, height: "40px", mt:"6px"}} onClick={createImagesClick}>Generate Collection!</Button>
                    </div>
                </CardContent>
            </Card>

            <div style={{display: "flex"}}>
                <TabContext value={selectedTab} orientation="horizontal">
                <Card sx={{ minWidth: 275, mr:2, mb:2}} >
                <CardContent style={{"display": "flex", "flexDirection": "column"}}>
                <div style={{"display": "flex", "flexDirection": "row", "justifyContent":"center"}}>
                        <h4>Project:    </h4>
                        <h4>{state.split("/")[1]}</h4>
                    </div>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" orientation="vertical">
                        <Tab label="All" value="All"/>
                        <Tab label="Create new layer" value="Main" onClick={showLayerDlg}/>
                        

                        {tabs.map(tab => (
                            <Tab 
                                icon={
                                    <CloseIcon onClick={(e) => handleTabClose(e, tab.value)} />
                                } iconPosition='end'
                                key={tab.value} label={tab.title} 
                                value={tab.value} 
                            />
                        ))}
                    </TabList>
                    </CardContent>
                    </Card>
                    

                    <TabPanel value="Main" >
                    <DialogCreateName createLayer={createLayer} setOpenDialog={setOpenDialog} openDialog={openDialog} title="Create Layer" content="Layer name"/>
                    </TabPanel>
                    <TabPanel value="All" >
                        <div style={{"display": "flex", "flexDirection": "row"}}>
                                {tabs.map((tab, index) =>
                                
                                    {
                                        return (
                                            <div key={index} >
                                                {
                                                tab.images.map((each, idx) => {
                                                    return (
                                                        <div key={idx} >
                                                                  <Card sx={{ minWidth: 275, mr:2, mb:2}} >
                                                                        <CardContent style={{"display": "flex", "flexDirection": "column"}}>
                                                                            <div style={{"display": "flex", "flexDirection": "row"}}>
                                                                                <img src={each.url} alt="Logo" width="150" height="150" style={{"boxShadow": "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"}} />
                                                                                <div>
                                                                                    <h4>Layer:   {tab.title}</h4>
                                                                                    <h4>Name:    {each.part_name}</h4>
                                                                                    <h4>Rarity:  {each.rarity}</h4>
                                                                                </div>
                                                                             </div>
                                                                             <Button sx={{ mt:2, backgroundColor: "#3DD1E7", color: "black"}} variant="contained" onClick={() => removeItemFromAllTab(index, idx, tab)}>remove</Button>
                                                                        </CardContent>
                                                                    </Card>
                                                                    
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        );
                                    }
                            )}
                        </div>
                    </TabPanel>

                                    
                    {tabs.map(panel => (
                        <TabPanel key={panel.value} value={panel.value}>
                            {panel.child()}
                        </TabPanel>
                    ))}
                </TabContext>
                
            </div>
        </div>
    );
}