// Init incarceration rate viz
export function init(year){
    life_cost(year);
   
}

// create viz for incarceration rate
function life_cost(year){
    read_data(year);

}

async function read_data(year){

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
        .then(data => {
            console.log(data)
            
        })



        // Import the incarceration/race data
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
        console.log(data)
        
    })



}
