// Initialize the education cost visualization
export function init(race) {
    education_cost(race);
}

// Creates the visualization for the education cost
function education_cost(race) {
  if (race != 'Select Race'){
    d3.csv("./data/education_attainment.csv", d => ({
       
        year_of_school: d.school_years, 
        white_percent: +d.not_hisp_white_percent,
        black_percent: +d.black_percent,
        asian_percent: +d.asian_percent,
        hispanic_percent: +d.hispanic_percent
      
        
    })).then(data => {
        // create the visualization
        // default will be black
        // dropdown menu for white, black, hispanic, and asian

        // filter on specified race
         let filtered_data = data.map(d => {
          return {
              year_of_school: d.year_of_school,
              percent: d[race.toLowerCase() + '_percent']
          };
      });

      console.log(filtered_data); // Check filtered data

      let percents = filtered_data.map(d=> {
        return d.percent
      })

      let years = filtered_data.map(d => {
        return d.year_of_school
      })

      percents.shift()
      years.shift()

     // Color mapping
      const yearColorMap = {
        "No diploma": "rgb(255,0,0)",
        "High school level": "rgb(0,128,0)",
        "2 years or less": "rgb(0,0,255)",
        "4 or more years": "rgb(255,255,61)",
      };

      // fixed order for legend
      const fixedOrder = [
        "No diploma",
        "High school level",
        "2 years or less",
        "4 or more years",
      ];
      
      // Sort by fixed order
      filtered_data.sort((a, b) => {
        return fixedOrder.indexOf(a.year_of_school) - fixedOrder.indexOf(b.year_of_school);
      });

      let colors = years.map(year => yearColorMap[year] || "#CCCCCC"); // default gray if missing

      let fields = [{
        type: "pie",
        labels: years,
        values: percents,
        marker: {
          colors: colors
        },
        hoverinfo: "none",
        textinfo: "label+percent",
        sort: false,
        textposition: 'outside',
        textfont:{
          color: '#22223B',
          family: 'Open Sans'
        }
      }];
      

      var layout = {
        height: 600,
        width: 800,
        legend: {
          x: 2, // push legend to the right (default is 1)
          y: 0.5,
          xanchor: 'right'
        },
        margin: {
          l: 150,
          r: 200,
          t: 100,
          b: 100
        },
        title: {
          text: `${race} Education Attainment Rate in 2022`,
          font: {
            size: 24,
            color: '#22223B',
            family: 'Open Sans'
          }
        },
        paper_bgcolor: '#E7D6CD'
      };

      
      Plotly.newPlot('pie', fields, layout);
    

    }).catch(error => console.error('Error loading data:', error));
  }
}


