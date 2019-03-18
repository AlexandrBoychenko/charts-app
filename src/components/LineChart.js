import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import colors from '../colors';
import { Helpers } from '../helpers';
import '../style/style.css';

class LineChart extends Component {
    componentDidMount() {

        let runDimensionLinear             = this.props.crossFilter.dimension(function(d) {return +d.week_ref;}),
            sumGroupLinear                 = runDimensionLinear.group().reduceSum(function(d) {return d[parameter];}),
            chartLine                      = dc.lineChart('#line-chart'),
            parameter                      = this.props.parameter,
            xAxisRange                     = this.setAxisRange(runDimensionLinear, 'week_ref'),
            dataRangeText                  = this.props.getMemoryData('dataRangeText');

        chartLine
            .height((element) => Helpers.calcHeight(element))
            .x(d3.scaleLinear().domain([xAxisRange.runMin, xAxisRange.runMax]))
            .margins({top: 10, right: 10, bottom: 50, left: 60})
            .xAxisLabel('Week Number')
            .yAxisLabel(`All ${Helpers.capitalizeFirstLetter(parameter)} Sum`)
            .renderDataPoints(true)
            .clipPadding(10)
            .dimension(runDimensionLinear)
            .group(sumGroupLinear)
            .colors(colors)
            .colorDomain ([0,16])
            .on('pretransition', () => {
                if (this.props.getMemoryData('dataRangeText').length)  {this.setPieTitle(['pastValue'], this.props.pieHeader, dataRangeText)}
            })
            .addFilterHandler((filters, filter) => {
                let binsIn = chartLine.group().all().filter(function(kv) {
                    return filter.isFiltered(kv.key) && kv.value;
                });
                dataRangeText = this.getDataRangeText(filter);
                this.setPieTitle(binsIn, this.props.pieHeader, dataRangeText);
                return binsIn.length ? [filter] : [];
            })
            //apply brush filter
            .brush().on('brushend.no-empty', () => {
            if(!chartLine.filters().length)
                window.setTimeout(() => {
                    chartLine.filterAll().redraw();
                }, 100);
        });

        this.props.setChartLine(chartLine);

        dc.renderAll();
    }

    setAxisRange(runDimensionLinear, key) {
        let runMin = +runDimensionLinear.bottom(1)[0][key];
        let runMax = +runDimensionLinear.top(1)[0][key];
        return {runMin, runMax}
    }

    getDataRangeText(filter) {
        let firstValue = Math.ceil(filter[0]);
        let secondValue = Math.floor(filter[filter.length - 1]);
        return (filter.length === 1) ? firstValue : firstValue + ' - ' + secondValue;
    }

    setPieTitle(binsIn, pieHeader, dataRangeText) {
        if (binsIn.length) {
            pieHeader.innerText = 'Weeks: ' + dataRangeText;
            return dataRangeText
        } else {
            pieHeader.innerText = this.props.initialPieText;
            this.props.setMemoryData('dataRangeText', '');
        }
    }

    render() {
        return (
             <div className="card">
                 <div className="header">
                     <h4 className="title">Time Line Chart</h4>
                     <p className="category">Actual data for {
                     Helpers.returnValue(this.props.csvData[0] && this.props.csvData[0]['year_ref'], '2014')}</p>
                 </div>
                 <div className="content">
                     <div id="line-chart" className="ct-chart"></div>
                 </div>
             </div>
        )
    }
}

export default LineChart
