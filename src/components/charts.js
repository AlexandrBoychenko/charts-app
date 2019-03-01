import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';
import { Helpers } from '../helpers';
import '../style/style.css';

class ChartLine extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        let chartLine = dc.lineChart('#line-chart');
        let chartPie = dc.pieChart('#pie-chart');

        let parameter = !!this.props.parameter ? this.props.parameter : 'markdown';

        let ndx                         = crossfilter(this.props.csvData),
            runDimensionLinear          = ndx.dimension(function(d) {return +d.week_ref;}),
            sumGroupLinear              = runDimensionLinear.group().reduceSum(function(d) {return d[parameter];}),
            runDimensionPie             = ndx.dimension(function(d) {return d.item_category;}),
            SumGroupPie                 = runDimensionPie.group().reduceSum(function(d) {return d[parameter];});

        chartLine.width((element) => Helpers.calcWidth(element, chartPie));

        chartPie
            .height(480)
            .innerRadius(100)
            .dimension(runDimensionPie)
            .group(SumGroupPie)
            .drawPaths(true)
            .legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', function(chartLine) {
                chartPie.selectAll('text.pie-slice').text(function(d) {
                    let resultAngle = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                    if (resultAngle <= 3 ) {return}
                    return dc.utils.printSingleValue(resultAngle) + '%';
                })
            });

        let xAxisRange = this.setAxisRange(runDimensionLinear, 'week_ref');

        chartLine.width((element) => Helpers.calcWidth(element, chartLine));

        chartLine
            .height(480)
            .x(d3.scaleLinear().domain([xAxisRange.runMin, xAxisRange.runMax]))
            .margins({top: 10, right: 10, bottom: 40, left: 50})
            .xAxisLabel('Time')
            .yAxisLabel(`${parameter[0].toUpperCase() + parameter.slice(1)} Sum`)
            //.renderArea(true)
            .renderDataPoints(true)
            .clipPadding(10)
            .dimension(runDimensionLinear)
            .group(sumGroupLinear);

        dc.renderAll();
    }

    setAxisRange(runDimensionLinear, key) {
        let runMin = +runDimensionLinear.bottom(1)[0][key];
        let runMax = +runDimensionLinear.top(1)[0][key];
        return {runMin, runMax}
    }

    render() {
        return (
            <div className="row">
                <div id="pie-chart" className="col-md-6">
                    <p className="chart-name">Pie Chart</p>
                </div>
                <div id="line-chart" className="col-md-6">
                    <p className="chart-name">Line Chart</p>
                </div>
            </div>
        );
    }
}

export default ChartLine;
