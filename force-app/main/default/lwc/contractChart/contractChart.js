import { LightningElement, track } from 'lwc'

import chartjs from '@salesforce/resourceUrl/ChartJs'
import { loadScript } from 'lightning/platformResourceLoader'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getChartByStatus from '@salesforce/apex/ContractController.getContractChart'

export default class ContractChart extends LightningElement {
  @track showLineChart = true
  @track showDounotChart = false
  @track record
  @track chartData = {}
  @track timeType

  error

  chart
  chartJSLoaded = false

  wireApexData () {
    // Check if a chart already exists
    if (this.chart) {
      // Clear the previous chart
      this.chart.destroy()
    }

    // Get chart type
    if (!localStorage.getItem('chartTimeType')) {
      localStorage.setItem('chartTimeType', 'chartFortnight')
    }
    this.timeType = localStorage.getItem('chartTimeType')
    // Get chart data
    getChartByStatus({ chartType: this.timeType })
      .then(result => {
        console.log('result: ', result)
        this.chartData = JSON.parse(result)
        this._buildChart(this.timeType)
        this.error = undefined
      })
      .catch(error => {
        this.error = error
      })
  }

  _buildChart (timeType) {
    // Selected button handle
    const chartTimeBtns = this.template.querySelectorAll('.chart-time-btn')
    chartTimeBtns.forEach(chartTimeBtn => {
      const chartTimeBtnVal = chartTimeBtn.getAttribute('data-value')
      if (chartTimeBtnVal === timeType) {
        chartTimeBtn.classList.remove('slds-button_neutral')
        chartTimeBtn.classList.add('slds-button_brand')
      } else {
        chartTimeBtn.classList.remove('slds-button_brand')
        chartTimeBtn.classList.add('slds-button_neutral')
      }
    })

    // this.chartData = {
    //     "remainingHours":[11, 6],
    //     "lables":["27/9/23", "11/10/23", "25/10/23", "8/11/23", "22/11/23", "6/12/23"],
    //     "forcasts":[11, 8.8, 6.6, 4.3999999999999995, 2.2, 0],
    //     "actualUses":[0, 5]
    // }

    const labelList = this.chartData.lables
    const plannedHours = this.chartData.forcasts
    const totalHours = this.chartData.remainingHours
    const usedHours = this.chartData.actualUses

    let canvas = this.template.querySelector('canvas')
    let context = canvas.getContext('2d')

    this.chart = new window.Chart(context, {
      type: 'line',
      data: {
        labels: labelList,
        datasets: [
          {
            data: plannedHours,
            label: 'Planned Support Hours',
            borderColor: '#00b3b3',
            lineTension: 0,
            borderWidth: 2,
            fill: false
          },
          {
            data: totalHours,
            label: 'Remaining Support Hours',
            borderColor: '#ff6666',
            lineTension: 0,
            borderWidth: 2,
            fill: false
          },
          {
            data: usedHours,
            label: 'Used Support Hours',
            borderColor: '#66cc00',
            lineTension: 0,
            borderWidth: 2,
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
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
        },
        maintainAspectRatio: false
      }
    })
  }

  renderedCallback () {
    if (!this.chartJSLoaded) {
      loadScript(this, chartjs)
        .then(() => {
          this.chartJSLoaded = true
          this.showLineChart = true
          this.wireApexData()
        })
        .catch(error => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Error Loading your Dashboard',
              message: error.message,
              variant: 'error'
            })
          )
        })
    }
  }

  handleShowLineChart () {
    this.showLineChart = true
    this.showDounotChart = false
  }

  handleShowDounotChart () {
    this.showDounotChart = true
    this.showLineChart = false
  }

  handleChartRefresh () {
    this.wireApexData()
  }

  handleChangeChartTime (event) {
    localStorage.setItem(
      'chartTimeType',
      event.target.getAttribute('data-value')
    )
    // Re-execute method to get chart data based on corresponding chart type
    this.wireApexData()
  }
}