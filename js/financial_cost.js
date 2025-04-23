//insert code here

let employed_race = [];
let median_occupation = [];
// Initialize the financial cost visualization
export function init(){
    financial_cost();
    console.log("init viz");
}


// Creates the visualization for the Finacial Cost
function financial_cost(){

    calc_finance_data().then(ratio_data=>{
        console.log(ratio_data);

        const data = [{
            z: [ratio_data[0], ratio_data[1], ratio_data[2], ratio_data[3]],
            x: ratio_data[4],
            y: ["Asian", "Hispanic", "White", "Black"],
            type: 'heatmap',
            colorscale: 'RdBu'
        }];

        const layout = {
            width: 800,  
            height: 600,  
        };
        
    
        Plotly.newPlot('heatmap', data, layout);
    }

    );
  
  
 
}


// calculate and import the finance data
async function calc_finance_data(){

    // holds all the ratio data and the 
    // names for the occupations
    let ratio_white = [];
    let ratio_asian = [];
    let ratio_black = [];
    let ratio_hispanic = [];
    let occupation_names = [];

    // Import the occupation by race data 
    await d3.csv("./data/employed_by_occupation.csv", d => ({        
        occupation: d.Occupation,
        total_employed: +d.Total_Employed,
        percent_women: +d.Women,
        percent_white: +d.White,
        percent_black: +d.Black_or_African_American,
        percent_asian: +d.Asian,
        percent_hispanic: +d.Hispanic_or_Latino
    }))
    .then(data => {
            employed_race = data;

            // get the first row which is the total numbers
            let total_numbers = employed_race[0];
            

            // loop through each row and calculate the ratios for each
            for(let i =0; i< employed_race.length;i++){
                occupation_names.push(employed_race[i].occupation);
                ratio_white.push(employed_race[i].percent_white/total_numbers.percent_white);
                ratio_hispanic.push(employed_race[i].percent_hispanic/total_numbers.percent_hispanic);
                ratio_black.push(employed_race[i].percent_black/total_numbers.percent_black);
                ratio_asian.push(employed_race[i].percent_asian/total_numbers.percent_asian);
            }

            

    })


    // Import the median income by occupation data 
    d3.csv("./data/median_income_by_occupation.csv", d => ({        
        occupation: d.Occupation,
        number_workers: +d.Number_of_workers,
        median_weekly_earnings: +d.Median_weekly_earnings
    }))
    .then(data => {
            console.log(data);
            median_occupation = data;
    })

    let results = [];
    results.push(ratio_asian, ratio_hispanic, ratio_white, ratio_black, occupation_names)
    return results;




}