// Initialize the financial cost visualization
// export function to be able to use in script.js
export function init(){
    financial_cost();
}


// Creates the visualization for the Finacial Cost
function financial_cost(){

    calc_finance_data().then(ratio_data=>{

        console.log(ratio_data)
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
    let first_data;
    let merge = [];

    // Import the median income by occupation data 
    await d3.csv("./data/median_by_occupations.csv", d => ({        
        occupation: d.Occupation,
        number_workers_2023: +d.Number_of_workers_2023.replace(/,/g, ""),
        median_2023: +d.Median_weekly_earnings_2023.replace(/,/g, ""),
        number_workers_2022: +d.Number_of_workers_2022.replace(/,/g, ""),
        median_2022: +d.Median_weekly_earnings_2022.replace(/,/g, "")
    }))
    .then(data => {
        // sort the occupations by the ones that earn the most so we can 
        // order it on the heat map

        //const median_year = `median_${year}` uncomment later, depending on the year they select change this
        const median_year = `median_2023`

        // remove NaN values then sort by the median salary
        data = data.filter(d => !isNaN(d[median_year])); 
        data.sort((a, b) => b[median_year] - a[median_year]);

        for (let i =0; i<data.length;i++){
            occupation_names.push(data[i].occupation);
            occupation_salary.push(data[i][median_year]);
        }
        first_data = data;
    })

    await d3.csv("./data/race_percents.csv", d => ({        
        occupation: d.Occupation,
        white_2023: +d.White_2023,
        black_2023: +d.Black_or_African_American_2023,
        asian_2023: +d.Asian_2023,
        hispanic_2023: +d.Hispanic_or_Latino_2023,
        white_2022: +d.White_2022,
        black_2022: +d.Black_or_African_American_2022,
        asian_2022: +d.Asian_2022,
        hispanic_2022: +d.Hispanic_or_Latino_2022,

    }))
    .then(data => {
        
        //const median_year = `median_${year}` uncomment later, depending on the year they select change this
        const median_year = `2022`

        // merge the data based on the occupation names
        for (let i =0; i<first_data.length;i++){
            const occupation_name = first_data[i].occupation;
            for(let j =0;j<data.length;j++){
                if(occupation_name == data[j].occupation){

                    
                    // Filter out NaN values
                    if( first_data[i].occupation !="" &&  !isNaN(first_data[i][`median_${median_year}`]) &&
                    !isNaN(data[j][`white_${median_year}`]) &&  !isNaN(data[j][`black_${median_year}`])
                        &&  !isNaN(data[j][`asian_${median_year}`]) &&  !isNaN(data[j][`hispanic_${median_year}`])){
                        // push to merge the two datasets
                        merge.push({
                            occupation: first_data[i].occupation,
                            median: first_data[i][`median_${median_year}`],
                            white: data[j][`white_${median_year}`],
                            black: data[j][`black_${median_year}`],
                            asian: data[j][`asian_${median_year}`],
                            hispanic: data[j][`hispanic_${median_year}`]
                        })
                        break;
                    }
                }
            }
        }


        // Get all of the base values for each race and the base median total
        const base_white =  merge.find(d => d.occupation == "Total, full-time wage and salary workers").white;
        const base_asian =  merge.find(d => d.occupation == "Total, full-time wage and salary workers").asian;
        const base_hispanic =  merge.find(d => d.occupation == "Total, full-time wage and salary workers").hispanic;
        const base_black =  merge.find(d => d.occupation == "Total, full-time wage and salary workers").black;
        const median_total = merge.find(d => d.occupation == "Total, full-time wage and salary workers");


        // split array to calculate the quartiles
        const below_median_arr = merge.filter(d=>d.median<median_total.median);
        const below_median_values = below_median_arr.map(d => d.median); 
        const above_median_arr =  merge.filter(d=>d.median>median_total.median);
        const above_median_values = above_median_arr.map(d => d.median); 


        // calculate quartiles
        const q1 = d3.median(below_median_values);
        const q3 = d3.median(above_median_values);

        
        // high pay is anything above q3
        const high_pay = merge.filter(d=>d.median>q3)



        let total_white = 0;
        let total_asian = 0;
        let total_hispanic = 0;
        let total_black = 0;
        for(let i =0; i< high_pay.length;i++){
            total_white+=high_pay[i].white;
            total_asian+=high_pay[i].asian;
        
            total_hispanic+=high_pay[i].hispanic;
            total_black+=high_pay[i].black;

        }
        let avg_white = total_white/high_pay.length;
        let avg_asian = total_asian/high_pay.length;
        let avg_hispanic = total_hispanic/high_pay.length;
        let avg_black = total_black/high_pay.length;


        console.log("high")
        console.log(avg_asian)
        console.log(avg_black)
        console.log(avg_hispanic)
        console.log(avg_white)
        

        // mid high pay is anything between q2 and q3
        const mid_high_pay = merge.filter(d=>median_total.median<d.median<q3)

        total_white = 0;
        total_asian = 0;
        total_hispanic = 0;
        total_black = 0;
        for(let i =0; i< mid_high_pay.length;i++){
            total_white+=mid_high_pay[i].white;
            total_asian+=mid_high_pay[i].asian;
        
            total_hispanic+=mid_high_pay[i].hispanic;
            total_black+=mid_high_pay[i].black;

        }
        avg_white = total_white/mid_high_pay.length;
        avg_asian = total_asian/mid_high_pay.length;
        avg_hispanic = total_hispanic/mid_high_pay.length;
        avg_black = total_black/mid_high_pay.length;
    

        console.log("midhigh")
        console.log(avg_asian)
        console.log(avg_black)
        console.log(avg_hispanic)
        console.log(avg_white)
        

        // low mid pay is anything between q1 and q2
        const low_mid_pay = merge.filter(d=>q1<d.median<median_total.median)
      

        total_white = 0;
        total_asian = 0;
        total_hispanic = 0;
        total_black = 0;
        for(let i =0; i< low_mid_pay.length;i++){
            total_white+=low_mid_pay[i].white;
            total_asian+=low_mid_pay[i].asian;
        
            total_hispanic+=low_mid_pay[i].hispanic;
            total_black+=low_mid_pay[i].black;

        }
        avg_white = total_white/low_mid_pay.length;
        avg_asian = total_asian/low_mid_pay.length;
        avg_hispanic = total_hispanic/low_mid_pay.length;
        avg_black = total_black/low_mid_pay.length;


        console.log("lowmid")
        console.log(avg_asian)
        console.log(avg_black)
        console.log(avg_hispanic)
        console.log(avg_white)
        
   

        // low pay is anything below q1
        const low_pay = merge.filter(d=>d.median<q1)

        total_white = 0;
        total_asian = 0;
        total_hispanic = 0;
        total_black = 0;
        for(let i =0; i< low_pay.length;i++){
            total_white+=low_pay[i].white;
            total_asian+=low_pay[i].asian;
        
            total_hispanic+=low_pay[i].hispanic;
            total_black+=low_pay[i].black;

        }
        avg_white = total_white/low_pay.length;
        avg_asian = total_asian/low_pay.length;
        avg_hispanic = total_hispanic/low_pay.length;
        avg_black = total_black/low_pay.length;

        console.log("low")
        console.log(avg_asian)
        console.log(avg_black)
        console.log(avg_hispanic)
        console.log(avg_white)
        

        console.log(base_asian)
        console.log(base_black)
        console.log(base_hispanic)
        console.log(base_white)
        
    })



    return merge;






}