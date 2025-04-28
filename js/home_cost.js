
  
export function init(year, asset){

    home_cost(year, asset);
   
}


// create the visualization
function home_cost(year, asset){


    import_data(year, asset).then(race_data=> {

        const squares = [];
        const population_squares = [];
        var rows = 0;
        var cols = 0;
        let index = 0;
        var curr_asset = ""

        if (asset == "Mortgages"){
            curr_asset = `mortgages`
        } else if (asset == "Real estate"){
            curr_asset = `real_estate`
        } else {
            curr_asset = `assets`
        }

        // adding the squares based on the asset selected
        race_data[0].forEach(d => {
            
            const curr_race = d.race
            const curr_val = d[curr_asset]
            
            for (let i = 0; i < curr_val; i++) {
                squares.push({
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
            x: squares.map(d => d.x),
            y: squares.map(d => d.y),
            mode: 'markers',
            type: 'scatter',
            marker: {
              size: 25,
              color: squares.map(d => {
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
            text: squares.map(d => d.race),
            hoverinfo: 'text', 
          };

        // create visualiztion for the population
        const square_traces_population = {
            x: population_squares.map(d => d.x),
            y: population_squares.map(d => d.y),
            mode: 'markers',
            type: 'scatter',
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
            text: population_squares.map(d => d.race),
            hoverinfo: 'text', 
            xaxis: 'x2',
            yaxis: 'y2'
          };
          


          const layout = {
            grid: {rows: 1, columns: 2, pattern: 'independent'},
            xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis: { showgrid: false, showticklabels: false, zeroline: false},
            xaxis2: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis2: { showgrid: false, showticklabels: false, zeroline: false},
            title: 'Population and Wealth By Race',
            width:1250,
            height:650,
            showlegend: false 
          };
          
          Plotly.newPlot('waffle-chart', [square_traces_wealth, square_traces_population], layout);

    })

   

}
 

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

        

        const averaged_data = [];

        // filter by selected year 
        const curr_data = data.filter(d => d.year === year);

        // group data by race
        const race_group = d3.group(curr_data, d => d.race);

        // loop through each of the races and average the data
        for (const [race, rows] of race_group) {

            // average each of the values across the races and push that data in the array
            averaged_data.push({
                race: race,
                assets: d3.sum(rows, d => d.assets),
                real_estate: d3.sum(rows, d => d.real_estate),
                mortgages: d3.sum(rows, d => d.mortgages),
                household_count: d3.sum(rows, d => d.household_count)

            })

        }


        // Get the total number of all the assets
        const total_assets = d3.sum(averaged_data, d =>  d.assets);
        const total_real_estate = d3.sum(averaged_data, d =>  d.real_estate);
        const total_mortgages = d3.sum(averaged_data, d =>  d.mortgages);
        const total_household_count = d3.sum(averaged_data, d =>  d.household_count);


        let normalized = [];

        // normalize the values
        normalized = averaged_data.map(d=> ({
            race: d.race,
            assets: Math.floor((d.assets/total_assets)*100),
            real_estate: Math.floor((d.real_estate/total_real_estate)*100),
            mortgages: Math.floor((d.mortgages/total_mortgages)*100),
            household_count: Math.floor((d.household_count/total_household_count)*100),

        }));


        // if the values don't add up to 100 spread the rest amongst the highest races in order
        var asset_remainder = 100 - d3.sum(normalized, d=>d.assets);
        var real_estate_remainder = 100 - d3.sum(normalized, d=>d.real_estate);
        var mortgages_remainder = 100 - d3.sum(normalized, d=>d.mortgages);
        var household_count_remainder = 100 - d3.sum(normalized, d=>d.household_count);



        // sort the values by the assets
        normalized.sort((a, b) => d3.descending(a.assets, b.assets));

        // add 1 to each value untill we run out of remainder
        normalized.forEach(d => {
            if(asset_remainder == 0){
                return
            }
            d.assets += 1;
            asset_remainder = asset_remainder - 1;
            
        });

        // sort the values by the real estate
        normalized.sort((a, b) => d3.descending(a.real_estate, b.real_estate));

        // add 1 to each value untill we run out of remainder
        normalized.forEach(d => {
            if(real_estate_remainder == 0){
                return
            }
            d.real_estate += 1;
            real_estate_remainder = real_estate_remainder - 1;
            
        });
        
        // sort the values by the mortgages
        normalized.sort((a, b) => d3.descending(a.mortgages, b.mortgages));

        // add 1 to each value untill we run out of remainder
        normalized.forEach(d => {
            if(mortgages_remainder == 0){
                return
            }
            d.mortgages += 1;
            mortgages_remainder = mortgages_remainder - 1;
            
        });

        // sort the values by the mortgages
        normalized.sort((a, b) => d3.descending(a.household_count, b.household_count));

        // add 1 to each value untill we run out of remainder
        normalized.forEach(d => {
            if(household_count_remainder == 0){
                return
            }
            d.household_count += 1;
            household_count_remainder = household_count_remainder - 1;
            
        });
    
    

        race_data.push(normalized) 
        


        
       
    })

    return race_data;


}