// Init incarceration rate viz
export function init(year){
    life_cost(year);
   
}

// create viz for incarceration rate
function life_cost(year){
    read_data(year).then(incar_data=>{
       
        // get all of the inc and pop vals
        const black_inc = incar_data.map(val=>val.black_inc);
        const white_inc = incar_data.map(val=>val.white_inc);
        const black_pop = incar_data.map(val=>val.black_pop);
        const white_pop = incar_data.map(val=>val.white_pop);
        const states = incar_data.map(val=>val.state)
        
        var black_rates = {
            x: black_pop,
            y: black_inc,
            mode: 'markers+text',
            type: 'scatter',
            name: 'Black Americans',
            hovertext: states,
            textposition: 'top center',
            marker: {
                size:12
            }

        };

        var white_rates = {
            x: white_pop,
            y: white_inc,
            mode: 'markers+text',
            type: 'scatter',
            name: 'White Americans',
            hovertext: states,
            textposition: 'top center',
            marker: {
                size:12
            }

        };

        var layout = {
            xaxis:{
                range:[0,1],
                title: {
                    text: '% of Population made up of specified race'
                }
            },
            yaxis:{
                range: [0,1],
                title: {
                    text: '% of Incarcerated Individuals made up of specified race'
                }
            }
        }

        var data = [black_rates, white_rates];

        Plotly.newPlot('line-chart', data, layout)




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
