// Initialize the financial cost visualization
// export function to be able to use in script.js
export function init(year){
    financial_cost(year);
}


// Creates the visualization for the Finacial Cost
function financial_cost(year){


    calc_finance_data(year).then(ratio_data=>{

        // variables for labels and colors
        const pays = ["High Salary", "Mid-High Salary", "Mid-Low Salary", "Low Salary"]
        const races = ['White', 'Asian', 'Black', 'Hispanic'];

        

        // make the arrows point left or right depending on the over or under representation
        const arrows = ratio_data.map(row =>
            //unicode for left and right arrows
            row.map(d => d > 1 ? '\u2192' : '\u2190')
          );
          
        // create the bars for the graph
        const bars = ratio_data.map((group, i) => {

           // return each graph
            return {
                x: group.map(d => (d - 1) * 100),  // Converting to percentages from the base of 1
                y: races,
                name: pays[i],
                orientation: 'h',
                type: 'bar',
                text: arrows[i],
                textposition: 'outside',
                textfont: {
                    size: 16,
                  },
                // specifiy which quadrant to plot the graph
                xaxis: `x${i+1}`,
                yaxis: `y${i+1}`,
                marker: {
                    color:"#22223B" 
                }
             
                
            };
        });
        
        // titles for each graph
        const titles= [{
            text: '<span style="font-weight:700;font-size:14">High Salary</span>',
            x:0.5, 
            y:1.15,
            yref: 'y1 domain',
            xref:'x1 domain',
            align:'center',
            showarrow:false
        }, {
            text: '<span style="font-weight:700;font-size:14">Mid-High Salary</span>',
            x:0.5,
            y:1.15,
            yref: 'y2 domain',
            xref:'x2 domain',
            align:'center',
            showarrow:false

        }, {
            text: '<span style="font-weight:700;font-size:14">Mid-Low Salary</span>',
            x:0.5,
            y:1.15,
            yref: 'y3 domain',
            xref:'x3 domain',
            align:'center',
            showarrow:false

        }, {
            text: '<span style="font-weight:700;font-size:14">Low Salary</span>',
            x:0.5,
            y:1.15,
            yref: 'y4 domain',
            xref:'x4 domain',
            align:'center',
            showarrow:false,
            

        }]

        // the grid surrounding the graphs to seperate them
        const shapes = [
            {
              type: 'rect',
              xref: 'x1 domain',
              yref:'y1 domain',
              x0: -0.20,
              x1: 1.10,
              y1: 1.23,
              y0: -0.20,
              line: {
                width: 2
              }
            },
            {
              type: 'rect',
              xref: 'x2 domain',
              yref:'y2 domain',
              x0: -0.15,
              x1: 1.10,
              y1: 1.23,
              y0: -0.20,
              line: {
                color: 'black',
                width: 2
              }
            },
            {
                type: 'rect',
                xref: 'x3 domain',
                yref:'y3 domain',
                x0: -0.20,
                x1: 1.10,
                y1: 1.23,
                y0: -0.20,
                line: {
                  width: 2
                }
              },
              {
                type: 'rect',
                xref: 'x4 domain',
                yref:'y4 domain',
                x0: -0.15,
                x1: 1.10,
                y1: 1.23,
                y0: -0.20,
                line: {
                  color: 'black',
                  width: 2
                }
              },
          ];

        // creating the layout for the graphs
        const layout = {
            barmode: 'group',
            paper_bgcolor: '#E7D6CD', 
            plot_bgcolor: '#E7D6CD',  
            grid: {
                rows: 2,
                columns: 2,
                pattern: "independent" // make sure that they actually show up in the grid
                
            },
            font: {
                family: 'Open Sans, sans-serif'
            },
            showlegend: false,
            xaxis1: { 
                range: [-80, 80],
                dtick:15,
                title: {
                    text: '% Underrepresented                                                  % Overrepresented',
                    standoff: 5, // add spacing between the graphs 
                    font: {
                        size:12
                    }
                    
                },
                side: 'bottom',

             },
            xaxis2: { 
                range: [-80, 80],
                dtick:15,
                title: {
                    text: '% Underrepresented                                                  % Overrepresented',
                    standoff: 5,
                    font: {
                        size:12
                    }
                    
                },
                side: 'bottom', },
            xaxis3: { 
                range: [-80, 80],
                dtick:15,
                title: {
                    text: '% Underrepresented                                                  % Overrepresented',
                    standoff: 5,
                    font: {
                        size:12
                    }
                    
                },
                side: 'bottom' },
            xaxis4: { 
                range: [-80, 80],
                dtick:15,
                title: {
                    text: '% Underrepresented                                                  % Overrepresented',
                    standoff: 5,
                    font: {
                        size:12
                    }
                    
                },
                side: 'bottom', },
            annotations:titles,
            width:1000,
            height:650,
            shapes: shapes,
            paper_bgcolor: '#F2E9E4', 
            plot_bgcolor: '#F2E9E4',
            margin: {
                r:70,
                l:100,
                b:70,
                t:70
            }
          
        };
    
        Plotly.newPlot('quadrantbar', bars, layout);
    }

    );
  
  
 
}


// calculate and import the finance data,
// made this async cause we need access
// to some variables right when we return
async function calc_finance_data(year){

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
        number_workers_2024: +d.Number_of_workers_2024.replace(/,/g, ""),
        median_2024: +d.Median_weekly_earnings_2024.replace(/,/g, ""),
        number_workers_2023: +d.Number_of_workers_2023.replace(/,/g, ""),
        median_2023: +d.Median_weekly_earnings_2023.replace(/,/g, ""),
        number_workers_2022: +d.Number_of_workers_2022.replace(/,/g, ""),
        median_2022: +d.Median_weekly_earnings_2022.replace(/,/g, ""),
        number_workers_2021: +d.Number_of_workers_2021.replace(/,/g, ""),
        median_2021: +d.Median_weekly_earnings_2021.replace(/,/g, ""),
        number_workers_2020: +d.Number_of_workers_2020.replace(/,/g, ""),
        median_2020: +d.Median_weekly_earnings_2020.replace(/,/g, "")
    }))
    .then(data => {
        // sort the occupations by the ones that earn the most so we can 

        const median_year = `median_${year}`

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
        white_2024: +d.White_2024,
        black_2024: +d.Black_or_African_American_2024,
        asian_2024: +d.Asian_2024,
        hispanic_2024: +d.Hispanic_or_Latino_2024,

        white_2023: +d.White_2023,
        black_2023: +d.Black_or_African_American_2023,
        asian_2023: +d.Asian_2023,
        hispanic_2023: +d.Hispanic_or_Latino_2023,

        white_2022: +d.White_2022,
        black_2022: +d.Black_or_African_American_2022,
        asian_2022: +d.Asian_2022,
        hispanic_2022: +d.Hispanic_or_Latino_2022,
       
        white_2021: +d.White_2021,
        black_2021: +d.Black_or_African_American_2021,
        asian_2021: +d.Asian_2021,
        hispanic_2021: +d.Hispanic_or_Latino_2021,

              
        white_2020: +d.White_2020,
        black_2020: +d.Black_or_African_American_2020,
        asian_2020: +d.Asian_2020,
        hispanic_2020: +d.Hispanic_or_Latino_2020,

    }))
    .then(data => {
        const median_year = year

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