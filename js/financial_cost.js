// Initialize the financial cost visualization
// export function to be able to use in script.js
export function init(){
    financial_cost();
}


// Creates the visualization for the Finacial Cost
function financial_cost(){

    calc_finance_data().then(ratio_data=>{

        // plot the ratio as the z value, the occupation name as the x value,
        // and the y value as the race
        const data = [{
            // specifiying the data and axis labels here
            z: [ratio_data[0], ratio_data[1], ratio_data[2], ratio_data[3]],
            x: ratio_data[4],
            y: ["Hispanic", "Black", "White", "Asian"],
            type: 'heatmap',

            //annotation stuff
            text: [ratio_data[0], ratio_data[1], ratio_data[2], ratio_data[3]].map(row => row.map(val => 
                    {   // format percentage and add if they are under or over represented
                        if(val <100){
                            return `underrepresented <br> by ${100-parseInt(val)}%`
                        } else if(val>100) {
                            return `overrepresented <br> by ${parseInt(val)-100}%`
                        } else {
                            return val.toFixed(1) +'%'
                        }
                    })),
            texttemplate: "%{text}",

            //legend here
            colorbar: {
                // change these to be dynamic
                tickvals: [40, 60, 80, 100, 120, 140, 160, 180],
                ticktext: ['40 Underrepresented','60', '80', '100', '120', '140', '160', '180 Overrepresented'], 
               
              },
             
            colorscale: [
                [0, 'blue'],
                [0.5, 'white'],
                [1, 'red']
              ]
        }];

        // annotations for th graph
        const median_salaries = [];
        for (let i = 0; i < 5; i++) {
            median_salaries.push({
                x: i, 
                y: 4,
                showarrow:false,
                text: `Median Salary of <br>$${ratio_data[5][i]}`

            });
        }

        // specify layout for heatmap, include callouts to highlight important parts,
        // the size of the heatmap, annotations, and removal of grid
        const layout = {
            shapes: [
                {
                  type: 'rectangle',
                  xref: 'x',
                  yref: 'y',
                  x0: 2.50, 
                  x1: 4.50, 
                  y0: 0.50, 
                  y1: 1.50,  
                  line: {
                    color: 'black',
                    width: 5
                  }
                },
                {
                    type: 'rectangle',
                    xref: 'x',
                    yref: 'y',
                    x0: -0.50, 
                    x1: 1.50, 
                    y0: 0.50, 
                    y1: 1.50,  
                    line: {
                      color: 'black',
                      width: 5
                    }
                  },

              ],
            width: 900,  
            height: 700,  
            xaxis: {showgrid: false},
            annotations: median_salaries
        };
        
        // graph the heatmap with the data and layout specified above
        Plotly.newPlot('heatmap', data, layout);
    }

    );
  
  
 
}


// calculate and import the finance data,
// made this async cause we need access
// to some variables right when we return
async function calc_finance_data(){

    // holds all the ratio data and the 
    // names for the occupations
    let ratio_white = [];
    let ratio_asian = [];
    let ratio_black = [];
    let ratio_hispanic = [];
    let occupation_names = [];
    let occupation_salary = [];

    // Import the median income by occupation data 
    await d3.csv("./data/median_income_by_occupation.csv", d => ({        
        occupation: d.Occupation,
        number_workers: +d.Number_of_workers,
        median_weekly_earnings: +d.Median_weekly_earnings
    }))
    .then(data => {
        // sort the occupations by the ones that earn the most so we can 
        // order it on the heat map
        data.sort((a, b) => b.median_weekly_earnings - a.median_weekly_earnings);

            for (let i =0; i<data.length;i++){
                // skip the total number we only want the categories of occupations in the heat map
                if(data[i].occupation!="Total_full_time_wage_and_salary_workers"){
                    occupation_names.push(data[i].occupation);
                    occupation_salary.push(data[i].median_weekly_earnings);
                }
            }

    })

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
            let employed_race = data;

            // get the first row which is the total numbers
            let total_numbers = employed_race[0];
            
            

            // loop through each occupation and calculate the ratio for each
            for(let i =0; i< occupation_names.length;i++){
                let value = data.find(employed_race => employed_race.occupation === occupation_names[i]);
                if(value != undefined){
                    ratio_white.push(value.percent_white/total_numbers.percent_white*100);
                    ratio_hispanic.push(value.percent_hispanic/total_numbers.percent_hispanic*100);
                    ratio_black.push(value.percent_black/total_numbers.percent_black*100);
                    ratio_asian.push(value.percent_asian/total_numbers.percent_asian*100);
                }
                
            }

            

    })

    // return the ratios of representations, the occcupation names, and the median ociptation salaries in an array
    let results = [];
    results.push(ratio_hispanic, ratio_black, ratio_white, ratio_asian, occupation_names, occupation_salary)
    return results;




}