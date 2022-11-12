import React, { useState, useReducer, useEffect} from "react";
import "./styles.css";
import {SimplePostRequest, BlobPostRequest} from './../common_item/SupportFunctions'
import {Card, CardActions, CardContent, Button, Typography, Box, CardActionArea, Select, MenuItem, InputLabel,TextField } from '@mui/material';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';

export default function JsonPanel(props) {


  useEffect(() => {
    console.log(props.rarity)
    // call the function
   // fetchData().catch(console.error);
  }, [])

  
  return (
    <div style={{"display": "flex", "flexWrap": "wrap", "flexDirection": "row", "minWidth": "200px", "marginRight": "0px", "marginBottom": "15px", "marginLeft": "auto"}}>

      <TextField id="outlined-basic" label="Name" variant="outlined" sx={{"width": 130}} value={props.part_name} onChange={props.partNameChange} />
            <Select sx={{"width": 120}}
                label="rarity"
                onChange={props.rarityChange}
                value={props.rarity}
            >
                <MenuItem value={"common"}>Common</MenuItem>
                <MenuItem value={"rare"}>Rare</MenuItem>
                <MenuItem value={"legendary"}>Legendary</MenuItem>
                <MenuItem value={"mythic"}>Mythic</MenuItem>
            </Select>
      
    </div>
  );
};