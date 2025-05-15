// Init incarceration rate viz
export function init(year){
    life_cost(year);
   
}

// create viz for incarceration rate
function life_cost(year){
    read_data(year).then(incar_data=>{
       
        const plot = document.getElementById('line-chart');
        const back = document.getElementById('back');


        // get all of the inc and pop vals
        const black_inc = incar_data.map(val=>val.black_inc);
        const white_inc = incar_data.map(val=>val.white_inc);
        const black_pop = incar_data.map(val=>val.black_pop);
        const white_pop = incar_data.map(val=>val.white_pop);
        let states = incar_data.map(val=>val.state);
        let black_diff = [];
        let white_diff = [];

        // get the ratio with each incarceration and population
        for(let i = 0; i< black_inc.length;i++){
            black_diff.push(black_inc[i]/black_pop[i]);
            white_diff.push(white_inc[i]/white_pop[i]);

        }

        // sort black diff and have everything else sort by black diff
        let sorted = [];
        for(let i =0; i<black_diff.length;i++){
            sorted[i] = [black_diff[i], white_diff[i], states[i]];
        }
        sorted.sort((a,b) => b[0] - a[0]);


        // get the results back in the original arays
        black_diff = sorted.map(d=>d[0]);
        white_diff = sorted.map(d=>d[1]);
        states = sorted.map(d=>d[2]);

        // make black bars
        const blackBars = {
            x: states,
            y: black_diff.map(d=> -d), // flip them to go down,
            text: black_diff.map((d,i)=>`${states[i]}: ${Math.abs(d.toFixed(2))}`),
            type: 'bar',
            marker: {
                color: 'red'
            },
            hovertemplate: '%{text}',
            name: 'Black Americans',
            textposition: 'none'

        }

        // make white bars
        const whiteBars = {
            x: states,
            y: white_diff,
            type: 'bar',
            marker: {
                color: "blue"
            },
            text: white_diff.map((d,i)=>`${states[i]}: ${Math.abs(d.toFixed(2))}`),
            hovertemplate: '%{text}',
            name: 'White Americans',
            textposition: 'none'

        }

        // layout for bars
        const layout = {
            width:950,
            height:650,
            margin: {
                t: 20,
                b: 145    
            },
            paper_bgcolor: '#F2E9E4', 
            plot_bgcolor: '#F2E9E4',  
            yaxis: {
                title:{
                    text:"Incarceration / Population Ratio",
                },
                zeroline: true,
                tickvals: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2],
                ticktext: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '1', '2'] //make sure vals are positive even when going down    
            },
            xaxis: {
                title:{
                    text:"State"
                },
            },
            barmode: 'overlay',
            legend: {
                "orientation": "h",
                x:0.25,
                y:1.1
            }
        
        }


        // call to show the bar graphs
        function show_bars(){
            // show the graph again
            var data = [blackBars, whiteBars]
            Plotly.newPlot(plot, data, layout);

            // hide back button
            back.style.display = 'none';

            //add the listener back
            plot.on('plotly_click', (data) => {

                const index = data.points[0].pointIndex;
                show_one_state(black_diff[index], white_diff[index], states[index]);
                
            });

        }

       // show details for one state
        function show_one_state(black, white, state){



            // show back button
            back.style.display = 'inline-block';

          
            // round everything to the nearest 0.5
            var black_ratio =  Math.round(black * 2) / 2;
            var white_ratio =  Math.round(white * 2) / 2;

  


            let black_squares_arr = [];
            let white_squares_arr = [];

            // check if it's 0.5 to add in a half square
            let black_five = false;
            let white_five = false;


            if (black_ratio % 1 == 0.5){
                black_five = true;
                black_ratio = black_ratio - 0.5;
            }
            if (white_ratio % 1 == 0.5){
                white_five = true;
                white_ratio = white_ratio - 0.5;
            }


            // add black squares
            let x = 1;
            let y = 0;
            for(let i =0; i< black_ratio;i++){

                black_squares_arr.push({
                    x: x * 1,
                    y: y,
                    size: 24
                })
                x = x + 1;
                if(x > 4){
                    x = 1;
                    y = y - 1
                    
                }

            }

            // add half square
            if(black_five == true){
                black_squares_arr.push({
                    x: x * 1,
                    y: y,
                    size: 12
                })
            }


            // add white squares
            x = 1;
            y = 0;
            for(let i =0; i< white_ratio;i++){
                white_squares_arr.push({
                    x: x * 1,
                    y: y,
                    size: 24

                })
                x = x + 1;

                x = x + 1;
                if(x > 4){
                    x = 1;
                    y = y - 1
                    
                }
            }

            // add half square
            if(white_five == true){
                white_squares_arr.push({
                    x: x * 1,
                    y: y,
                    size: 12
                })
            }



            // if ratio has 0.5 add half sqaure
            if(white_ratio % 0.5 == 1){
            white_squares_arr.push({
                x: x * 1,
                y: y,
                size: 12
            })

            }

        


            // create visualiztion for black squares
            const black_squares = {
                x: black_squares_arr.map(d => d.x),
                y: black_squares_arr.map(d => d.y),
                xaxis: 'x1',
                yaxis: 'y1',
                mode: 'markers',
                type: 'scatter',
                marker: {
                    color: 'black',
                    symbol: 'square',
                    size: black_squares_arr.map(d => d.size),
            }};


            // create visualiztion for white squares
              const white_squares = {
                x: white_squares_arr.map(d => d.x),
                y: white_squares_arr.map(d => d.y),
                xaxis: 'x2',
                yaxis: 'y2',
                mode: 'markers',
                type: 'scatter',
                marker: {
                color: 'white',
                symbol: 'square',
                size: white_squares_arr.map(d => d.size),
            }};



             // layout for the two square groups
            const layout = {
                grid: {rows: 1, columns: 2, pattern: 'independent'},
                xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
                yaxis: { showgrid: false, showticklabels: false, zeroline: false},
                xaxis2: { showgrid: false,  showticklabels: false, zeroline: false},
                yaxis2: { showgrid: false, showticklabels: false, zeroline: false},
                width:800,
                height:250,
                margin: {
                    t: 30,   
                    b: 20    
                },
                paper_bgcolor: '#F2E9E4', 
                plot_bgcolor: '#F2E9E4',  
                showlegend:false,
            };
        


            Plotly.newPlot(plot, [black_squares, white_squares], layout);
        }



        // call to show the initial graphs 
        show_bars();

        // they clicked the back button so show the previous graphic
        back.onclick = show_bars;

    


        


     })






    

}





async function read_data(year){
    var incar_data = [];

    var combined_data = [];


    // Import the incarceration/race data
    await d3.csv("./data/incarceration_rates.csv", d => ({        
        state: d.State,
        total_2019_inc: +d.Total_2019.replace(/,/g, ""),
        white_2019_inc: +d.White_2019.replace(/,/g, ""),
        black_2019_inc: +d.Black_2019.replace(/,/g, ""),
        total_2020_inc: +d.Total_2020.replace(/,/g, ""),
        white_2020_inc: +d.White_2020.replace(/,/g, ""),
        black_2020_inc: +d.Black_2020.replace(/,/g, ""),
        total_2021_inc: +d.Total_2021.replace(/,/g, ""),
        white_2021_inc: +d.White_2021.replace(/,/g, ""),
        black_2021_inc: +d.Black_2021.replace(/,/g, ""),
        total_2022_inc: +d.Total_2022.replace(/,/g, ""),
        white_2022_inc: +d.White_2022.replace(/,/g, ""),
        black_2022_inc: +d.Black_2022.replace(/,/g, ""),


    }))
    .then(data => {incar_data = data})


    await d3.csv("./data/single_race_population.csv", d => ({        
            state: d.Location,
            white_2019_pop: +d.White_2019,
            black_2019_pop: +d.Black_2019,
            white_2020_pop: +d.White_2020,
            black_2020_pop: +d.Black_2020,
            white_2021_pop: +d.White_2021,
            black_2021_pop: +d.Black_2021,
            white_2022_pop: +d.White_2022,
            black_2022_pop: +d.Black_2022,
    
    
        }))
        .then(data => {
            const selected_incar = [];
            const selected_pop = [];
            const combined = [];

            // get all incarceration data for the selected year

            incar_data.forEach(d => {
                selected_incar.push({
                    state: d.state,
                    white_inc: d[`white_${year}_inc`]/d[`total_${year}_inc`],
                    black_inc: d[`black_${year}_inc`]/d[`total_${year}_inc`],
                });
            });



            // get all population data for selected year

            data.forEach(d => {
                selected_pop.push({
                    state: d.state,
                    white: d[`white_${year}_pop`],
                    black: d[`black_${year}_pop`]
                });
            });




            //combine the data on the state
            for(let i =0; i<selected_incar.length;i++){

                const curr_incar = selected_incar[i];
                const curr_state = selected_incar[i].state;

                if(curr_state == "National"){
                    combined.push({
                        state: "National",
                        white_pop: selected_pop.find(d=>d.state == "United States").white,
                        black_pop: selected_pop.find(d=>d.state == "United States").black,
                        white_inc: curr_incar.white_inc,
                        black_inc: curr_incar.black_inc

                    })
                } else{

                    combined.push({
                        state: curr_state,
                        white_pop: selected_pop.find(d=>d.state == curr_state).white,
                        black_pop: selected_pop.find(d=>d.state == curr_state).black,
                        white_inc: curr_incar.white_inc,
                        black_inc: curr_incar.black_inc

                    })
                    

                }

            }

           combined_data = combined;
           
           







    
            
        })
        return combined_data;

    
        
    
    

    



 


}
