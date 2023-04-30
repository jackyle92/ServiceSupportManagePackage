import { LightningElement, track, wire } from 'lwc';

import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getChartByStatus from '@salesforce/apex/ContractController.getContractChart'; 

export default class ContractChart extends LightningElement {

    @track showLineChart = true;
    @track showDounotChart = false;
    @track record;
    @track chartData = {};

    error;
   
    chart;
    chartJSLoaded = false;

    wireApexData() {
        console.log('two time');
        getChartByStatus()
        .then(result=>{
            console.log('result: ', result);
            this.chartData = JSON.parse(result);
            
            this._buildChart();
            this.error = undefined;
        })
        .catch(error=>{
            this.error = error;
        })
    } 

    _buildChart(){

      
        const labelList = this.chartData.lables;

        const plannedHours = this.chartData.forcasts;

        const totalHours = this.chartData.remainingHours;

        const usedHours = this.chartData.actualUses;

       
        console.log('============== labelList ============== : ' + JSON.stringify(labelList));
        console.log('============== plannedHours ============== : ' + plannedHours);
        console.log('============== totalHours ============== : ' + totalHours);
        console.log('============== usedHours ============== : ' + usedHours);
        

        let canvas = this.template.querySelector("canvas");
        let context = canvas.getContext("2d");
        this.chart = new window.Chart(context, {
            type: 'line',
            data: {
                labels: labelList,
                datasets: [{ 
                    data: plannedHours,
                    label: "Planned Support Hours",
                    borderColor: "#00b3b3",
                    lineTension: 0,
                    borderWidth:2,
                    fill: false
                }, { 
                    data: totalHours,
                    label: "Remaining Support Hours",
                    borderColor: "#ff6666",
                    lineTension: 0,
                    borderWidth:2,
                    fill: false
                }, { 
                    data:  usedHours,
                    label: "Used Support Hours",
                    borderColor: "#66cc00",
                    lineTension: 0,
                    borderWidth:2,
                    fill: false
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Plan Breakdown'
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display:false
                        }
                    }]
                }
            }
        })
    }
    renderedCallback() {
        if (!this.chartJSLoaded) {
            loadScript(this, chartjs)
                .then(() => {
                    this.chartJSLoaded = true;
                    this.showLineChart = true;
                    this.wireApexData();
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Error Loading your Dash",
                            message: error.message,
                            variant: "error"
                        })
                    );
                });
        }

      
    }
   
    handleShowLineChart(){
        this.showLineChart = true;
        this.showDounotChart = false;

    }

    handleShowDounotChart(){
        this.showDounotChart = true;
        this.showLineChart = false;

      
    }
    
    handleChartRefresh(){
        this._buildChart();

    }

  
}