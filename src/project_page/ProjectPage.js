import { useNavigate  } from 'react-router-dom'
import React, { useState, useEffect, useReducer } from 'react';
import DialogCreateName from './../Dialog/DialogCreateName';
import {SimplePostRequest, SimplePostWithRequest, BlobPostRequest} from '../common_item/SupportFunctions'
import DialogDelete from './../Dialog/DialogDelete';
import './../common_item/Background.css'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import BlockIcon from '@mui/icons-material/Block';
import HorizontalNonLinearStepper from './../HorizontalNonLinearStepper'


import {Card, CardActions, CardContent, Button, Typography, Box, CardActionArea } from '@mui/material';

function ProjectPage() {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const projectPath = "nftool";
    const [projectsList, setProjectsList] = useState([]);
    const navigate = useNavigate();
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const [projectDelete, setProjectDelete] = React.useState("");

    const fetchData = async () => {
        SimplePostRequest("/api/v1/files/ls", getProjectsName, createMainProjectDirectory)
    }
    useEffect(() => {
        console.log("prog update")
        fetchData().catch(console.error);
      }, [])


    function getProjectsName(data){
        for (let i = 0; i < data.Entries.length; i++) {
            if (data.Entries[i].Name === projectPath){
                console.log("up!" + data.Entries[i].Name);
                SimplePostRequest('/api/v1/files/ls?arg=/' + projectPath, setProjects, empty_err)
            }
        }
        createMainProjectDirectory()
    }

    function setProjects(data){
        console.log(data)
        if (data.Entries != null){
            setProjectsList(data.Entries);

            for (var i =0; i < data.Entries.length; i++){
                console.log(data.Entries)
                SimplePostWithRequest('/api/v1/files/ls?arg=/' + projectPath + '/'+data.Entries[i].Name + '/images', addImage, empty_err, data.Entries[i].Name, data.Entries)
            }
         }
    }

    function addImage(data, projectName, arr){
        
        if (data != undefined && data.Entries.length > 0){
            console.log(data)
            BlobPostRequest('/api/v1/files/read?arg=/' + projectPath + '/' + projectName + '/images/' + data.Entries[0].Name, setImage, empty_err, projectName, arr)
        }
    }

    function setImage(data, projectName, arr){

        for (var i = 0; i < arr.length; i++){
            console.log(arr[i].Name + " ok1 " + projectName)
            if (arr[i].Name === projectName){
                
                const url = URL.createObjectURL(data);
                arr[i].img = url;
                console.log("ok2")
                setProjectsList(arr)
                forceUpdate()
                break
            }
        }
        
       // const updates = projectsList.filter((name, idx1) => name.name === projectName);
       /* tabs[index].images = updates;
        setTabs(tabs)/**/
        //console.log(updates)
        console.log(projectsList)
        console.log(data)
        //BlobPostRequest('/api/v1/files/read?arg=/' + props.state + '/' + props.layer + '/' + props.selectedTab + '/' + data.Entries[i].Name, pushDataImages, empty_err)
    }

    function empty(data){

    }

    function empty_err(){

    }

    function createMainProjectDirectory(){
        SimplePostRequest('/api/v1/files/mkdir?arg=/'+projectPath, empty, empty_err)
    }
    

    function createProject(name){
        SimplePostRequest('/api/v1/files/mkdir?arg=/'+projectPath+'/'+name, update, empty_err)
    }

    function openProject(name){
        navigate('/current_project_page', {state: projectPath+'/'+name, project: name}/*{path: projectPath+'/'+name}*/);
    }

    function openDialogCreateProject(){
        setOpenCreateDialog(true);
    }

    function openDialogDeleteProject(name){
        setProjectDelete(name)
        setOpenDeleteDialog(true);
    }

    function update(data){
        fetchData().catch(console.error);
    }

    function deleteProject(){
        SimplePostRequest('/api/v1/files/rm?arg=/'+projectPath+'/'+projectDelete +'&recursive=true&force=true', update, empty_err)
    }

    return (
        <div className="main-image">
            <HorizontalNonLinearStepper step={1} state={"test"}/>
            <div style={{"display": "flex", "flexWrap": "wrap", "padding": 20}}>
                
                <DialogCreateName createLayer={createProject} setOpenDialog={setOpenCreateDialog} openDialog={openCreateDialog}
                title="Create Project" content="Project name"
                />
                <DialogDelete deleteFunction={deleteProject} setOpenDialog={setOpenDeleteDialog}
                 openDialog={openDeleteDialog} title="Remove Project" content={"Remove '" +projectDelete+ "' from projects list?"}/>
                <div style={{"display": "flex", "flexWrap": "wrap"}}>
                        <Card sx={{ minWidth: 275, mr:2, mb:2}} >
                            <CardActionArea onClick={openDialogCreateProject}>
                                <CardContent style={{"display": "flex", "flexDirection": "column"}}>
                                    <NoteAddOutlinedIcon sx={{ width: 250,  height:250, mt:2}}/>
                                    <Button variant="contained" onClick={openDialogCreateProject}>Create project</Button>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    
                    {
                    projectsList.map((each, idx) => (
                    <div key={idx}>
                         <Card sx={{ minWidth: 275, mr:2, mb:2}} >
                            <CardContent style={{"display": "flex", "flexDirection": "column"}}>
                                <CardActionArea onClick={() => openProject(each.Name)}>
                                        <Typography variant="h5" component="div">{each.Name}</Typography> 
                                        {each.img === undefined ? (
                                            <BlockIcon sx={{ width: 220,  height:220, mt:2}}/>) :
                                            (<img src={each.img} alt="Logo" width="235" height="235"/>)

                                        }
                                </CardActionArea>
                                        
                                <Button sx={{ mt:2, backgroundColor: "#3DD1E7", color: "black"}} variant="contained"  onClick={() => openDialogDeleteProject(each.Name)}>remove</Button >
                            </CardContent>
                           
                        </Card>
                    </div>
                    )
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectPage;