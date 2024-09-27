import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";



export const isset = (v) => {
    if(typeof v != "undefined"){
        return true
    }else{
        return false;
        
    }
}
export const generateId = () => Math.random().toString(36).substr(2, 9);
export const $ajax_post = (method, ref, data, successcallback) => {
    // axios.post();    
    const fetchData = async () => {
        var API_URL = "https://curiousrubik.us/dev/pmsdevapi.php?gyu=";
        // try{
        //     if(typeof CUSTOM_API_URL != "undefined"){
        //         if(isset(CUSTOM_API_URL)){
        //             API_URL = CUSTOM_API_URL;
        //         }
        //     }
        // }
        // catch(e)
        // {
        //     API_URL = "https://curiousrubik.us/dev/pmsdevapi.php?gyu=";
        // }
        const _ut = API_URL+ref+"&t="+(new Date()).getTime();
        const response = await axios.post(_ut, {"body":data});
        successcallback(response.data.data);
        return response.data;
    }
    return fetchData();
}


