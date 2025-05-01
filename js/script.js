//insert code here

import { init as financeinit } from './financial_cost.js';
import { init as homeinit } from './home_cost.js';


// function for selecting year
function selectYearFinance(){
    const year = document.getElementById('select').value;
    if(year !="Select Year:"){
        financeinit(year);
    }
  
}

// function for selecting year and wealth value
function selectWealthValue(){
    const asset = document.getElementById('select-wealth-value').value;
    const year = document.getElementById('select-year').value;

    if(asset !="Select Wealth Measure:" && year!="Select Year:"){
        homeinit(year, asset);
        document.getElementById('head-population').innerHTML = `100 squares representing race breakdown <br>in America in ${year}`;
        console.log(asset)
        document.getElementById('head-ownership').innerHTML = `100 squares representing race breakdown of all ${asset} ownership in America in ${year}`;
    } 
}



// Initialize the website
function init(){
    // allow user to change the year for financial cost
    document.getElementById("select").onchange = selectYearFinance;
    document.getElementById("select-wealth-value").onchange = selectWealthValue;
    document.getElementById("select-year").onchange = selectWealthValue;


    
    //initialize financial cost graphic, defaults to 2023
    financeinit("2024");
    homeinit("2024", "Assets");


}


init();