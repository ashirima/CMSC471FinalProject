// Init incarceration rate viz
export function init(year){
    life_cost(year);
   
}

// create viz for incarceration rate
function life_cost(year){
    read_data(year).then(incar_data=>{

        // the plot
        const plot = document.getElementById('bar-chart');

        //init the buttons
        const back = document.getElementById('back');
        const top_ten_btn = document.getElementById('top-ten-states');
        const last_ten_btn = document.getElementById('last-ten-states');

        // init the dynamic text
        const incar_text = document.getElementById('national-incar');

        // filter out for the national level
        const filtered_data = incar_data.filter(d=>d.state!="National")

        // get just the national level data
        const national_data = incar_data.filter(d => d.state=="National")
        const black_national_ratio = (national_data[0].black_inc/national_data[0].black_pop).toFixed(1)
        const white_national_ratio = (national_data[0].white_inc/national_data[0].white_pop).toFixed(1)

        // add in the text that talks about the national level
        incar_text.innerText = `Nationally, Black Americans are represented at ${black_national_ratio}x their population in jails while
        White Americans are only represented at ${white_national_ratio}x their populations in jails.`


        // get all of the inc and pop vals
        const black_inc = filtered_data.map(val=>val.black_inc);
        const white_inc = filtered_data.map(val=>val.white_inc);
        const black_pop = filtered_data.map(val=>val.black_pop);
        const white_pop = filtered_data.map(val=>val.white_pop);
        let states = filtered_data.map(val=>val.state);
        let black_diff = [];
        let white_diff = [];

        // get the ratio with each incarceration and population
        for(let i = 0; i< black_inc.length;i++){
            black_diff.push(black_inc[i]/black_pop[i]);
            white_diff.push(white_inc[i]/white_pop[i]);

        }

        // sort the array by the ratio of the black Americans
        let sorted = [];
        for(let i =0; i<black_diff.length;i++){
            sorted[i] = [black_diff[i], white_diff[i], states[i], black_pop[i]];
        }
        sorted.sort((a,b) => b[0] - a[0]);


        // get the results back in the original arrays
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
                color: 'black',
                line: {
                    color: 'black',
                    width: 1
                  }
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
                color: "white",
                line: {
                    color: 'black',
                    width: 0.5 
                  }
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
                tickvals: [-13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2],
                ticktext: ['13','12', '11','10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '1', '2'] //make sure vals are positive even when going down    
            },
            xaxis: {
                title:{
                    text:"State"
                },
            },
            barmode: 'overlay',
            legend: {
                "orientation": "h",
                x:0.32,
                y:1.1
            }
        
        }


        // call to show the bar graphs
        function show_bars(){

            //plot graphs
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
            back.style.display = 'block';

            // round everything to the nearest 0.5
            var black_ratio =  Math.round(black * 2) / 2;
            var white_ratio =  Math.round(white * 2) / 2;
            var diff = black_ratio - white_ratio + 1;

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
                    opacity:1,
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
                opacity:1,
                // added so we can see the white better
                line: {
                    color: 'black',     
                    width: 1            
                  },
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
                    b: 50    
                },
                paper_bgcolor: '#F2E9E4', 
                plot_bgcolor: '#F2E9E4',  
                showlegend:false,
                // annotation for each state
                annotations: [
                    {
                    x: 0.5,
                    y: -0.10,           
                    xref: 'paper',
                    yref: 'paper',         
                    text: `In ${state}, Black Americans are around ${diff} times more likely to be jailed than White Americans`,
                    showarrow: false,
                    font: {
                        size: 14
                    },
                     
                    }
                  ],
            };
        


            Plotly.newPlot(plot, [black_squares, white_squares], layout);
        }



        // call to show the initial graphs 
        show_bars();

        // they clicked the back button so show the main graphic
        back.onclick = show_bars;


        // sort by black population and get the top ten 
        // and last ten populated states by Black Americans
        sorted.sort((a,b) => b[3] - a[3]);

        let top_ten = sorted.slice(0,10).map(d=>d[2]);
        let last_ten = sorted.slice(-10).map(d=>d[2]);
  
        let top_highlighted = false;
        let last_hightlighted = false;

        // add listener for both buttons
        // to highlight either top ten
        // or last ten buttons
        top_ten_btn.addEventListener('click', () => {
            if(top_highlighted){
                // resest back to default
                highlight_last_or_top(false, true);
                top_highlighted = false;
            } else {
                highlight_last_or_top(false, false);
                top_highlighted = true;
            }
            
           
        }
        );

        last_ten_btn.addEventListener('click', () => {
            if(last_hightlighted){
                // resest back to default
                highlight_last_or_top(true, true);
                last_hightlighted = false;
            } else {
                highlight_last_or_top(true, false);
                last_hightlighted = true;
            }
           
        }
        );


        /// based on the button they select show a highlight for the top ten or last
        // ten populated states by Black Americans
        function highlight_last_or_top(is_last, reset){
            let selected_states = top_ten;
            let highlight_color = 'black';
            let highlight_width = 1;
            if(is_last){
                selected_states = last_ten;
            } 

            if (!reset){
                highlight_color = states.map(state =>
                    selected_states.includes(state) ? 'red' : 'black',
                );
                highlight_width = states.map(state => 
                    selected_states.includes(state) ? 2 : 1,
                );
            }
          
            Plotly.restyle('bar-chart', {
                'marker.line.color': [highlight_color],
                'marker.line.width': [highlight_width]
              
            }, [0]); 
        }


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
                } else {
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
