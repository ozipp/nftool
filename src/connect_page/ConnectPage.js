import { useNavigate  } from 'react-router-dom'
import { useLocation  } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import {SimplePostRequest, GetCookies} from '../common_item/SupportFunctions'
import HorizontalNonLinearStepper from './../HorizontalNonLinearStepper'
import './../common_item/Background.css'
import './ConnectPage.css'

function ConnectPage() {
    const { state } = useLocation();
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [path, setPath] = useState("http://127.0.0.1:5001");
    const [showError, setShowError] = useState(false);


    useEffect(() => {
        setShowError(false)
        // declare the data fetching function
        const fetchData = async () => {
            handleClick();
        }

        let path1 = GetCookies()
        if (path1 != undefined && path1.length > 0){
            
            
            setPath(path1)
        }
        console.log("path11")
        console.log(path1)
      
        if (state == undefined || state.length == 0)
            fetchData().catch(console.error);
      }, [])

    function changePage(response){
        
        setShowError(false)
      //  cookies.set('path', path, { path: '/' });
        navigate('/project_page');
    }

    function showErr(){
        setShowError(true)
    }

    function handleClick(){
        cookies.set('path', path, { path: '/' });
        SimplePostRequest('/api/v1/id', changePage, showErr);
    }
  

    function handleChange(event){
        setPath(event.target.value);
    }
      
    return (
        <div className="main-image">
            <HorizontalNonLinearStepper step={0} state={""}/>
            <div className="common-div">
                <div style={ {'display': 'inline-block'}}>
                    <h1>BTFS node address</h1>
                    <input value={path} onChange={handleChange}/>
                    <button onClick={handleClick}>connect</button>
                    <h2 className={showError ? "fa fa-trash" : "fa fa-trash hidden"}>Can't connect to BTFS node</h2>
                </div>
            </div>
        </div>
    );
}

export default ConnectPage;