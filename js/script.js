//insert code here

import { init as financeinit } from './financial_cost.js';

// function for selecting year
function selectYearFinance(){
    const year = document.getElementById('select').value;
    if(year !="Select Year:"){
        financeinit(year);
    }
}

// Initialize the website
function init(){
    // allow user to change the year for financial cost
    document.getElementById("select").onchange = selectYearFinance;

    
    //initialize financial cost graphic, defaults to 2023
    financeinit("2024");


}


init();