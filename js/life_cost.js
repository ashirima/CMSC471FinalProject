// Init incarceration rate viz
export function init(year){
    life_cost(year);
   
}

// create viz for incarceration rate
function life_cost(year){
    read_data(year).then(incar_data=>{
        console.log(incar_data.find(d=>d.state=="National"))
        const national_avg = incar_data.find(d=>d.state=="National")

        // create viz for national averages
        var data = [
            {
                type: 'scatter',
                mode: 'markers',
                x: [0.5],  
                y: [1],  
                marker: {
                    size: national_avg.white_pop * 300,  
                    color: '#1e81b0', 
                    opacity: 0.7
                },
            },
            {
                type: 'scatter',
                mode: 'markers',
                x: [1],  
                y: [1],  
                marker: {
                    size: national_avg.white_inc * 300,
                    color: '#040f79',
                    opacity: 0.7
                },
            },
            {
                type: 'scatter',
                mode: 'markers',
                x: [2],  
                y: [1], 
                marker: {
                    size:  national_avg.black_pop * 300,  
                    color: 'orange',
                    opacity: 0.7
                }
            },
            {
                type: 'scatter',
                mode: 'markers',
                x: [2.5],
                y: [1],  
                marker: {
                    size:  national_avg.black_inc * 300,  
                    color: '#794504',
                    opacity: 0.7
                }
            }
        ];
        const layout = {
            xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis: { showgrid: false, showticklabels: false, zeroline: false},
            width:650,
            height:450,
            margin: {
                t: 30,   
                b: 20    
              },
            paper_bgcolor: '#F2E9E4', 
            plot_bgcolor: '#F2E9E4',  
            showlegend:false,
          };

        Plotly.newPlot('circles-comp-national', data, layout);



     var row = 0;
     var col = 0.5;
     const circles = [];
     // create viz for the 50 states
     incar_data.forEach((curr_data) => { 

        circles.push({
            type: 'scatter',
            mode: 'markers',
            x: [col],  
            y: [row],  
            marker: {
                size: curr_data.white_pop * 50,  
                color: '#1e81b0', 
                opacity: 0.7
            },
        })

        circles.push({
            type: 'scatter',
            mode: 'markers',
            x: [col+0.3],  
            y: [row],  
            marker: {
                size: curr_data.white_inc * 50,
                color: '#040f79',
                opacity: 0.7
            },
        })
        circles.push({
            type: 'scatter',
            mode: 'markers',
            x: [col+1.5],  
            y: [row], 
            marker: {
                size:  curr_data.black_pop * 50,  
                color: 'orange',
                opacity: 0.7
            }
        })
        circles.push({
            type: 'scatter',
            mode: 'markers',
            x: [col + 2],
            y: [row],  
            marker: {
                size:  curr_data.black_inc * 50,  
                color: '#794504',
                opacity: 0.7
            }
        })


        row = row + 1;

        const layout = {
            xaxis: { showgrid: false,  showticklabels: false, zeroline: false},
            yaxis: { showgrid: false, showticklabels: false, zeroline: false},
            width:650,
            height:1500,
            margin: {
                t: 30,   
                b: 20    
              },
            paper_bgcolor: '#F2E9E4', 
            plot_bgcolor: '#F2E9E4',  
            showlegend:false,
          };

        Plotly.newPlot('circles-states', circles, layout);



     })



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
