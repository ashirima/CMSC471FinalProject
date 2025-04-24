// Initialize the financial cost visualization
// export function to be able to use in script.js
export function init(){
    financial_cost();
}


// Creates the visualization for the Finacial Cost
function financial_cost(){

    calc_finance_data().then(ratio_data=>{

        console.log(ratio_data)

        const pays = ["High Salary", "Mid-High Salary", "Mid-Low Salary", "Low Salary"]
        const races = ['White', 'Asian', 'Black', 'Hispanic'];
        const colors = ['rgb(111,156,61)', "rgb(165,201,15)", "rgb(255,136,41)", "rgb(193,0,13)"]

        

        // make the arrows point left or right depending on the over or under representation
        const arrows = ratio_data.map(row =>
            row.map(d => d > 1 ? '→' : '←')
          );
          
        
          const bars = ratio_data.map((group, i) => {

           
            return {
                x: group.map(d => (d - 1) * 100),  // Converting to percentages from the base of 1
                y: races,
                name: pays[i],
                orientation: 'h',
                type: 'bar',
                text: arrows[i],
                // specifiy which quadrant to plot the graph
                xaxis: `x${i+1}`,
                yaxis: `y${i+1}`,
                marker: {
                    color:colors[i]    
                }
             
                
            };
        });
        
        const titles= [{
            text:"High Salary",
            x:0.5,
            y:1.25,
            yref: 'y1 domain',
            xref:'x1 domain',
            align:'center',
            showarrow:false
        }, {
            text:"Mid-High Salary",
            x:0.5,
            y:1.25,
            yref: 'y2 domain',
            xref:'x2 domain',
            align:'center',
            showarrow:false

        }, {
            text:"Mid-Low Salary",
            x:0.5,
            y:1.25,
            yref: 'y3 domain',
            xref:'x3 domain',
            align:'center',
            showarrow:false

        }, {
            text:"Low Salary",
            x:0.5,
            y:1.25,
            yref: 'y4 domain',
            xref:'x4 domain',
            align:'center',
            showarrow:false

        }]
        const layout = {
            barmode: 'group',
            grid: {
                rows: 2,
                columns: 2,
                pattern: "independent"
            },
            showlegend: false,
            xaxis1: { range: [-90, 90] },
            xaxis2: { range: [-90, 90] },
            xaxis3: { range: [-90, 90] },
            xaxis4: { range: [-90, 90] },
            annotations:titles,
            width:1000,
            height:550
          
        };
    
        Plotly.newPlot('quadrantbar', bars, layout);
    }

    );
  
  
 
}


// calculate and import the finance data,
// made this async cause we need access
// to some variables right when we return
async function calc_finance_data(){

    // holds all the ratio data and the 
    // names for the occupations
   
    let occupation_names = [];
    let occupation_salary = [];
    let first_data;
    let ratios = [];
    let merge =[];

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

    // import the race percents data
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
        const median_year = `2023`

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
        // low pay is anything below q1
        const low_pay = merge.filter(d=>d.median<q1)
        // low mid pay is anything between q1 and q2
        const low_mid_pay = merge.filter(d=>q1<d.median<median_total.median)
        // mid high pay is anything between q2 and q3
        const mid_high_pay = merge.filter(d=>median_total.median<d.median<q3)


        // make an array for all of the pays
        let pays = [high_pay, mid_high_pay, low_mid_pay, low_pay]

        // make an array for all the ratios we will get from the results
        ratios = [[],[],[],[]]

        // for each of the pay ranges calculate the over/under representative ratio
        for(let i = 0; i< pays.length;i++){
            let total_white = 0;
            let total_asian = 0;
            let total_hispanic = 0;
            let total_black = 0;

            for(let j =0; j< pays[i].length;j++){
                total_white+=pays[i][j].white;
                total_asian+=pays[i][j].asian;
                total_hispanic+=pays[i][j].hispanic;
                total_black+=pays[i][j].black;
    
            }
            let avg_white = total_white/pays[i].length;
            let avg_asian = total_asian/pays[i].length;
            let avg_hispanic = total_hispanic/pays[i].length;
            let avg_black = total_black/pays[i].length;

            ratios[i].push(avg_white/base_white)
            ratios[i].push(avg_asian/base_asian)
            ratios[i].push(avg_black/base_black)
            ratios[i].push(avg_hispanic/base_hispanic)
    

        }


    })


    return ratios;


}