import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export function GetCookies(){
    let path = cookies.get('path');
    return path;
}

export function SimplePostRequest(url_request, success_f, error_f){
    let path = cookies.get('path');
    console.log(path + url_request)
    const options = {
        method: 'POST',
        url: path + url_request,
        headers: {accept: 'application/json'}
    };
    axios
    .request(options)
    .then(function (response) {
        //console.log(response.data);
            success_f(response.data);
    })
    .catch(function (error) {
        error_f();
        
        //console.error(error);
    });
}

export function SimplePostWithRequest(url_request, success_f, error_f, title, dataarr){
    let path = cookies.get('path');
    console.log(path + url_request)
    const options = {
        method: 'POST',
        url: path + url_request,
        headers: {accept: 'application/json'}
    };
    axios
    .request(options)
    .then(function (response) {
        success_f(response.data, title, dataarr);
    })
    .catch(function (error) {
        error_f();
        
        //console.error(error);
    });
}

export function BlobPostRequest(url_request, success_f, error_f, title, dataarr){
    let path = cookies.get('path');
    console.log(path + url_request)
    const options = {
        method: 'POST',
        url: path + url_request,
        responseType: "blob",
        headers: {accept: 'application/json'}
    };
    axios
   
    .request(options)
    .then(function (response) {
        //console.log(response.data);
        success_f(response.data, title, dataarr);
    })
    .catch(function (error) {
        error_f();
        
        //console.error(error);
    });
}

export function DataPostRequest(url_request, data, success_f, error_f){
    let path = cookies.get('path');
    console.log(path + url_request)
    const options = {
        method: 'POST',
        data: data,
        url: path + url_request,
        headers: {accept: 'application/json'}
    };
    axios
    .request(options)
    .then(function (response) {
        console.log(response.data);
        success_f(response.data);
    })
    .catch(function (error) {
        error_f();
        
        //console.error(error);
    });
}

export function DataPostRequestWithParam(url_request, data, success_f, error_f, name, obj){
    let path = cookies.get('path');
    console.log(path + url_request)
    const options = {
        method: 'POST',
        data: data,
        url: path + url_request,
        headers: {accept: 'application/json'}
    };
    axios
    .request(options)
    .then(function (response) {
        console.log(response.data);
        success_f(response.data, name, obj);
    })
    .catch(function (error) {
        error_f();
        
        //console.error(error);
    });
}