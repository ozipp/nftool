import React from 'react';
import { Routes , Route } from 'react-router-dom';

import MainPage from './main_page/MainPage';
import ConnectPage from './connect_page/ConnectPage'
import ProjectPage from './project_page/ProjectPage';
import PinPage from './pin_item/PinPage'
import LayersList from './upload_files/LayersList';
import FinalImageCollection from './final_image_collection/FinalImageCollection';
//import Signup from '../pages/Signup';
//<Route exact path='/signup' component={Signup}></Route>
const Main = () => {
  return (
    <Routes > {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' element={<MainPage/>}></Route>
      <Route exact path='/connect_page' element={<ConnectPage/>}></Route>
      <Route exact path='/project_page' element={<ProjectPage/>}></Route>
      <Route exact path='/current_project_page' element={<LayersList/>}></Route>
      <Route exact path='/final_page' element={<FinalImageCollection/>}></Route>
      <Route exact path='/pin_page' element={<PinPage/>}></Route>
      
      
    </Routes >
  );
}
/*<Route exact path='/' element={<Home/>}></Route>*/
export default Main;