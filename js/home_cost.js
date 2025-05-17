
// TODO: make note that you can hover over squares

export function init(year, asset){
    // explaining what each square represents
    squares();

    //explaining what a perfect world would look like
    equal_unequal(true);

    // explaining what our world looks like actually
    equal_unequal(false);

    // big viz with the drop down and 100 squares
    home_cost(year, asset);
    
   
}



// create visualization for explaining what each square represents
function squares(){

    const population_squares = [];

    // push one square for each race
    population_squares.push({
        race: "White",
        x: 1 * 8, // the 8 is the spacing
        y: 0  
    }, {
        race: "Other",
        x: 2 * 8, 
        y: 0  
    }, {
        race: "Hispanic",
        x: 3 * 8, 
        y: 0 
    }, {
        race: "Black",
        x: 4 * 8, 
        y: 0  
    })


    // create visualiztion for the four squares
    const square_traces_population = {
        x: population_squares.map(d => d.x),
        y: population_squares.map(d => d.y),
        mode: 'markers',
        type: 'scatter',
        text: population_squares.map(d => d.race),
        hoverinfo: 'skip', 
        marker: {
            size: 50,
            color: population_squares.map(d => {
              if (d.race === "White"){
                  return "red"
              };
              if (d.race === "Black"){
                  return "yellow"
              };
              if (d.race === "Hispanic"){
                  return "blue";
              } 
              if (d.race === "Other"){
                  return "green";
              } 
            }),
            symbol: 'square'
          },
      };

      // create layout for the four squares
      const layout = {
        xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
        yaxis: { showgrid: false, showticklabels: false, zeroline: false},
        width:500,
        height:150,
        paper_bgcolor: '#F2E9E4', 
        plot_bgcolor: '#F2E9E4',  
        showlegend:false,
        margin: {
            t: 30,   
            b: 20    
          },
        annotations: [ // labels for the squares
            {
                x: 1 * 8,
                y:  1,
                text: 'White<br>Household',
                font: { 
                    size: 12,
                },
                align: 'center',
                showarrow: false,
            }, 
            {
                x: 2 * 8,
                y: 1,
                text: 'Other<br>Household',
                font: { 
                    size: 12
                 },
                align: 'center',
                showarrow: false,
            },
            {
                x: 3 * 8,
                y: 1,
                text: 'Hispanic<br>Household',
                font: { 
                    size: 12
                 },
                align: 'center',
                showarrow: false,
            },   {
                x: 4 * 8,
                y:  1,
                text: 'Black<br>Household',
                font: { 
                    size: 12
                 },
                align: 'center',
                showarrow: false,
            }
           ]
      };

      // plot the four squares 
      Plotly.newPlot('squares', [square_traces_population], layout);
     
      
}

// create visualization for explaining what a perfect world and what our world looks like
function equal_unequal(equal){

    const races = ["White", "Black", "Hispanic", "Asian"]

    // squares for the population and wealth distribution
    const population_squares = [];
    const wealth_squares = [];

    // layout for the sqaures
    const space = 8
    var curr_row = 1;
    var curr_col = 1;
    const max_squares = 16;

    // population representation, initially 4 squares one of each race
    population_squares.push({
        race: "White",
        x: 1 * 8, // the 1 is the spacing
        y: 2,        
    }, {
        race: "Black",
        x: 2 * 8, 
        y: 2  
    }, {
        race: "Hispanic",
        x: 3 * 8, 
        y: 2 
    }, {
        race: "Other",
        x: 4 * 8, 
        y: 2
    })

    // everytime someone clicks the add square button, it adds another square
    function add_squares(){
        // if we didn't hit the max squares keep adding a random race
        if(population_squares.length != max_squares){
            let new_square = {
                race: races[Math.floor(Math.random() * 3)], // get a random race
                x: curr_col * space,
                y: curr_row
            }


            population_squares.push(new_square);

            // if its the equal representation just push the square
            if(equal){
                wealth_squares.push(new_square);
            } else {
                // if its unequal you have a 82% chance of getting White, 12% chance of getting other
                // 4% chance of getting Black, 2% chance of getting Hispanic
                var chance = Math.random() * 100
                let new_wealth_square = {};
                if(chance<82){
                    new_wealth_square = {
                        race: "White",
                        x: curr_col * space,
                        y : curr_row
                    }
                } else if (chance<94){
                    new_wealth_square = {
                        race: "Other",
                        x: curr_col * space,
                        y : curr_row
                    }
                } else if (chance<98){
                    new_wealth_square = {
                        race: "Black",
                        x: curr_col * space,
                        y : curr_row
                    }
                } else {
                    new_wealth_square = {
                        race: "Hispanic",
                        x: curr_col * space,
                        y : curr_row
                    }
                }
                wealth_squares.push(new_wealth_square);
                
            }

            curr_col = curr_col + 1;
            // start new row if we reach the end of the columns
            if(curr_col > 4){
                curr_col = 1;
                curr_row = curr_row -1;
    
            }
    
            // redraw with the new square
            redraw();
        }
       
      
    }

    // reset the viz with just the four squares
    function reset_viz(){
        while(population_squares.length>4){
            population_squares.pop();
            wealth_squares.pop();

        }
        // reset the beginning rows and cols
        curr_row = 1;
        curr_col = 1;

        // redraw viz with initial squares
        redraw();
    }
    // change button listener depending on if its equal or unequal
    if(equal){
        document.getElementById("add-square-equal").addEventListener("click", add_squares);
        document.getElementById("reset-square-equal").addEventListener("click", reset_viz);
    } else {
        document.getElementById("add-square-unequal").addEventListener("click", add_squares);
        document.getElementById("reset-square-unequal").addEventListener("click", reset_viz);
    }
   


   if(equal){
        // if we are doing the equal viz just set the wealth squares to the population squares
        population_squares.forEach(d=>wealth_squares.push(d))
   } else{
        wealth_squares.push({
            race: "White",
            x: 1 * 8, // the 1 is the spacing
            y: 2,        
        }, {
            race: "White",
            x: 2 * 8, 
            y: 2  
        }, {
            race: "White",
            x: 3 * 8, 
            y: 2 
        }, {
            race: "Other",
            x: 4 * 8, 
            y: 2
        })
   }
    
    
    

    // redraws the viz if more squares were added
    function redraw(){

         // create visualiztion for the population 9 squares
        const square_traces_population = {
            x: population_squares.map(d => d.x),
            y: population_squares.map(d => d.y),
            mode: 'markers',
            type: 'scatter',
            text: population_squares.map(d => d.race),
            hoverinfo: 'text', 
            marker: {
            size: 25,
            color: population_squares.map(d => {
                if (d.race === "White"){
                    return "red"
                };
                if (d.race === "Black"){
                    return "yellow"
                };
                if (d.race === "Hispanic"){
                    return "blue";
                } 
                if (d.race === "Other"){
                    return "green";
                } 
            }),
            symbol: 'square'
            },
            
        };
    
        // create visualiztion for the wealth up to 16 squares
        const squares_wealth_traces = {
            x: wealth_squares.map(d => d.x),
            y: wealth_squares.map(d => d.y),
            mode: 'markers+text',
            type: 'scatter',
            hoverinfo: 'text',
            hovertext: wealth_squares.map(d => d.race),
            xaxis: 'x2',
            yaxis: 'y2',

            // show the money in the squares
            text: wealth_squares.map(d => `$`),  
            textfont: {
                size: 20,
                color: 'black'
            },
            marker: {
            size: 25,
            color: wealth_squares.map(d => {
                if (d.race === "White"){
                    return "red"
                };
                if (d.race === "Black"){
                    return "yellow"
                };
                if (d.race === "Hispanic"){
                    return "blue";
                } 
                if (d.race === "Other"){
                    return "green";
                } 
            }),
            symbol: 'square'
            }
            

        };

        
        // layout for the two 16 square groups
        const layout = {
            grid: {rows: 1, columns: 2, pattern: 'independent'},
            xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis: { showgrid: false, showticklabels: false, zeroline: false},
            xaxis2: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis2: { showgrid: false, showticklabels: false, zeroline: false},
            width:600,
            height:300,
            margin: {
                t: 30,   
                b: 20    
            },
            paper_bgcolor: '#F2E9E4', 
            plot_bgcolor: '#F2E9E4',  
            showlegend:false,
        };

        if(equal){
            // if its equal show equal breakdown otherwise show unequal breakdown
            Plotly.newPlot('equal-breakdown', [square_traces_population, squares_wealth_traces], layout);
            
        } else{
            Plotly.newPlot('unequal-breakdown', [square_traces_population, squares_wealth_traces], layout);

        }
        
    }

    redraw();
    
     
}




// create the main interactive visualization
function home_cost(year, asset){

    // first import the data from the import_data function
    import_data(year, asset).then(race_data=> {

        // population representation and wealth representation
        const wealth_squares = [];
        const population_squares = [];

        
        var curr_black = ""
        var curr_asset = ""

        // for setting up the squares
        var rows = 0;
        var cols = 0;
        let index = 0;

        // determining what asset the user selected
        if (asset == "Mortgage"){
            curr_asset = `mortgages`
        } else if (asset == "Real estate"){
            curr_asset = `real_estate`
        } else {
            curr_asset = `assets`
        }

        // find the "black" row of data
        curr_black = race_data[0].find(d => d.race == "Black")
       
        // changing text dynamically based on the current black row and current asset selected
        document.getElementById('black-breakdown').innerHTML = `As we add more squares we start to build the racial breakdown of households in America.<br>
        In ${year}, Black Americans made up ${curr_black.household_count}% of the households in America`;

        document.getElementById('info-black-comp').innerHTML = `In ${year}, Black Households in America represented ${curr_black.household_count}%
        of the population but only represented ${curr_black[curr_asset]}% of all ${asset} ownership.`;


        // adding the squares based on the asset selected
        race_data[0].forEach(d => {
            
            const curr_race = d.race
            const curr_val = d[curr_asset]
            
            for (let i = 0; i < curr_val; i++) {
                // keep adding to the wealth squares
                wealth_squares.push({
                    race: curr_race,
                    x: cols * 1, // the 1 is the spacing
                    y: -rows * 1 
                });
                // add to the column to keep placing squares horizontally
                cols++;

                // if we reach the end of the column start a new row
                if (cols == 10){ 
                    cols = 0; 
                    rows = rows + 1;
                }
                index++;
            }
                
        });

        // adding the squares based on the populations 
        race_data[0].forEach(d => {
        
            const curr_race = d.race
            const curr_val = d.household_count
            
            for (let i = 0; i < curr_val; i++) {
                population_squares.push({
                    race: curr_race,
                    x: cols * 1, // the 1 is the spacing
                    y: -rows * 1 
                });

                cols++;

                // if we reach the end of the column start a new row
                if (cols == 10){ 
                    cols = 0; 
                    rows = rows + 1;
                }
                index++;
            }
                
        });
        

        // create visualiztion for the wealth
        const square_traces_wealth = {
            x: wealth_squares.map(d => d.x),
            y: wealth_squares.map(d => d.y),
            mode: 'markers+text',
            type: 'scatter',
            text: wealth_squares.map(d => `$`),  // show the money in the squares
            textfont: {
                size: 20,
                color: 'black'
            },
            hovertext: wealth_squares.map(d => d.race),  //make sure hover text sticks as race when changing other text to $
            hoverinfo: 'text', 
            xaxis: 'x2',
            yaxis: 'y2',
            marker: {
              size: 25,
              color: wealth_squares.map(d => {
                if (d.race === "White"){
                    return "red"
                };
                if (d.race === "Black"){
                    return "yellow"
                };
                if (d.race === "Hispanic"){
                    return "blue";
                } 
                if (d.race === "Other"){
                    return "green";
                } 
              }),
              symbol: 'square'
            }
          };

        // create visualiztion for the population
        const square_traces_population = {
            x: population_squares.map(d => d.x),
            y: population_squares.map(d => d.y),
            mode: 'markers',
            type: 'scatter',
            text: population_squares.map(d => d.race),
            hoverinfo: 'text', 
            marker: {
              size: 25,
              color: population_squares.map(d => {
                if (d.race === "White"){
                    return "red"
                };
                if (d.race === "Black"){
                    return "yellow"
                };
                if (d.race === "Hispanic"){
                    return "blue";
                } 
                if (d.race === "Other"){
                    return "green";
                } 
              }),
              symbol: 'square'
            }
          };
          

          // create layout that is a grid with two columns
          // left column has population, right column has wealth
          const layout = {
            grid: {rows: 1, columns: 2, pattern: 'independent'},
            xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis: { showgrid: false, showticklabels: false, zeroline: false},
            xaxis2: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis2: { showgrid: false, showticklabels: false, zeroline: false},
            width:1100,
            height:450,
            margin: {
                t: 30,   
                b: 20    
              },
            paper_bgcolor: '#F2E9E4', 
            plot_bgcolor: '#F2E9E4',  
            showlegend:false,
          };

          // this is the layout for just the population breakdown
          const layout_example = {
            xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis: { showgrid: false, showticklabels: false, zeroline: false},
            width:550,
            height:450,
            margin: {
                t: 30,   
                b: 20    
              },
            paper_bgcolor: '#F2E9E4', 
            plot_bgcolor: '#F2E9E4',  
            showlegend:false,
          };


        
          // this is the example distribution of races
          Plotly.newPlot('racial-breakdown', [square_traces_population], layout_example);

          // this is the main interactive graph
          Plotly.newPlot('waffle-chart', [square_traces_population, square_traces_wealth], layout);

    })

   

}
 
// import and clean the data based on the year selected
async function import_data(year){

    const race_data = [];

    // Import the assets and the race data
    await d3.csv("./data/dfa-race-shares-detail.csv", d => ({        
        year: d.Date.split(':')[0],
        race: d.Category,
        assets: +d.Assets,
        real_estate: +d.Real_estate,
        mortgages: +d.Mortgages,
        household_count: d.Household_count
    }))
    .then(data => {

        // sum data across the quarters in the data set (Q1, Q2, Q3, Q4 are all in 2024)
        const sum_data = [];

        // filter by selected year 
        const curr_data = data.filter(d => d.year === year);

        // group data by race
        const race_group = d3.group(curr_data, d => d.race);

        // loop through each of the races and average the data
        for (const [race, rows] of race_group) {

            // sum each of the values across the races and push that data in the array
            sum_data.push({
                race: race,
                assets: d3.sum(rows, d => d.assets),
                real_estate: d3.sum(rows, d => d.real_estate),
                mortgages: d3.sum(rows, d => d.mortgages),
                household_count: d3.sum(rows, d => d.household_count)

            })

        }


        // Get the total number of all the assets
        const total_assets = d3.sum(sum_data, d =>  d.assets);
        const total_real_estate = d3.sum(sum_data, d =>  d.real_estate);
        const total_mortgages = d3.sum(sum_data, d =>  d.mortgages);
        const total_household_count = d3.sum(sum_data, d =>  d.household_count);

        // we need to change this percent representation to out of a whole number 100
        // so we need to normalize the data
        let normalize = [];

        // average and normalize the values
        normalize = sum_data.map(d=> ({
            race: d.race,
            assets: Math.floor((d.assets/total_assets)*100),
            real_estate: Math.floor((d.real_estate/total_real_estate)*100),
            mortgages: Math.floor((d.mortgages/total_mortgages)*100),
            household_count: Math.floor((d.household_count/total_household_count)*100),

        }));


        // if the values don't add up to 100 spread the rest amongst the highest races in order
        var asset_remainder = 100 - d3.sum(normalize, d=>d.assets);
        var real_estate_remainder = 100 - d3.sum(normalize, d=>d.real_estate);
        var mortgages_remainder = 100 - d3.sum(normalize, d=>d.mortgages);
        var household_count_remainder = 100 - d3.sum(normalize, d=>d.household_count);



        // sort the values by the assets
        normalize.sort((a, b) => d3.descending(a.assets, b.assets));
        // add 1 to each value untill we run out of remainder
        normalize.forEach(d => {
            if(asset_remainder == 0){
                return
            }
            d.assets += 1;
            asset_remainder = asset_remainder - 1;
            
        });

        // sort the values by the real estate
        normalize.sort((a, b) => d3.descending(a.real_estate, b.real_estate));
        // add 1 to each value untill we run out of remainder
        normalize.forEach(d => {
            if(real_estate_remainder == 0){
                return
            }
            d.real_estate += 1;
            real_estate_remainder = real_estate_remainder - 1;
            
        });
        
        // sort the values by the mortgages
        normalize.sort((a, b) => d3.descending(a.mortgages, b.mortgages));
        // add 1 to each value untill we run out of remainder
        normalize.forEach(d => {
            if(mortgages_remainder == 0){
                return
            }
            d.mortgages += 1;
            mortgages_remainder = mortgages_remainder - 1;
            
        });

        // sort the values by the mortgages
        normalize.sort((a, b) => d3.descending(a.household_count, b.household_count));
        // add 1 to each value untill we run out of remainder
        normalize.forEach(d => {
            if(household_count_remainder == 0){
                return
            }
            d.household_count += 1;
            household_count_remainder = household_count_remainder - 1;
            
        });
    
        race_data.push(normalize) 
        


        
       
    })

    // return summed, averaged, and normalized data
    return race_data;


}