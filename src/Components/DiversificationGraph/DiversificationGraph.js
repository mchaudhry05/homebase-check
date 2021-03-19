import Chart from "chart.js";
import { useEffect, useState } from "react";

const DiversificationGraph = ({ graphData, width, height, color, showLegend, sectorSelected, setSectorSelected, showLabel}) => {
  
  var myChart;
  /**
   * useEffect here is being used to use Chart.js to make the chart
   * of the diversity of the portfolio
   */
  useEffect(() => {
    const ctx = document.getElementById("myChart");
    if (myChart) {
      myChart.destroy();
    }
    if(graphData){
    let data = []; 
    let labels = [];

    for(let [key, value] of graphData.entries()){
        data.push(value); 
        labels.push(key);
    }

    myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: "white",
            fill: true,
            backgroundColor: ["#A2ADFF", "#29DBB1", "#FFAA47", "#FBCC03", "#EF4444", "#34C9E1", "#00AFCE", "#FF7951"], 
            hoverOffset: 4, 
          },
        ],
      }, 
      options:{
        legend: {
          display: showLegend,
        },
        tooltips: {
          // Disable the on-canvas tooltip
          enabled: showLabel,
          
        },
        responsive: true,
        onClick: showLabel ? showSelectedStocks : null, 

     
    },
    
    })
}
  }, [graphData, myChart]);


 let previousChoice = "";  
 /**
  * showSelectedStocks filters the user view such 
  * that they see the stocks from the sectors they 
  * have selected
  * @param {Event} event is the event that triggered the call
  * @param {Array} array is an array with the element that were clicked
  */
 const showSelectedStocks = (event, array) =>{

   if (array[0]){
     
     const sector = array[0]._model.label;
     if(previousChoice !== sector){
        previousChoice = sector;
        setSectorSelected(sector);
     }else if(previousChoice === sector){
       previousChoice = "All"
       setSectorSelected("All");
     }
   }
 }

  return (
    <div className="graph-holder" width={width+"px"} height={height+"px"}>
      <div id="chart-holder" width={width+"px"} height={height+"px"} style={{backgroundColor: color}}>
        <canvas id="myChart" width={width+"px"} height={height+"px"} style={{backgroundColor: color}}></canvas>
      </div>
    </div>
  )
}

export default DiversificationGraph;
