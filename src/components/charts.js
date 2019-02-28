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
        let chart = dc.lineChart('#line-chart');
        let chart2 = dc.pieChart('#pie-chart');

        let parameter = !!this.props.parameter ? this.props.parameter : 'markdown';

        let ndx                 = crossfilter(this.props.csvData),
            runDimension        = ndx.dimension(function(d) {return +d.week_ref;}),
            speedSumGroup       = runDimension.group().reduceSum(function(d) {return d[parameter];}),
            runDimension2        = ndx.dimension(function(d) {return d.item_category;}),
            markdownSumGroup2    = runDimension2.group().reduceSum(function(d) {return d[parameter];});

        chart2.width((element) => Helpers.calcWidth(element, chart2));

        chart2
            .height(480)
            .innerRadius(100)
            .dimension(runDimension2)
            .group(markdownSumGroup2)
            .minAngleForLabel(15)
            .drawPaths(true)
            .legend(dc.legend())
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', function(chart) {
                chart.selectAll('text.pie-slice').text(function(d) {
                    let resultAngle = (d.endAngle - d.startAngle) / (2*Math.PI) * 100;
                    if (resultAngle <= 3 ) {return}
                    return dc.utils.printSingleValue(resultAngle) + '%';
                })
            });

        let xAxisRange = this.setAxisRange(runDimension, 'week_ref');

        chart.width((element) => Helpers.calcWidth(element, chart));

        chart
            .height(480)
            .x(d3.scaleLinear().domain([xAxisRange.runMin, xAxisRange.runMax]))
            .margins({top: 10, right: 70, bottom: 50, left: 100})
            .xAxisLabel('Time')
            .yAxisLabel(`${parameter} Sum`)
            .renderArea(true)
            .renderDataPoints(true)
            .linearColors(["#4575b4", "#ffffbf", "#a50026"])
            .clipPadding(10)
            .dimension(runDimension)
            .group(speedSumGroup);

        dc.renderAll();
    }

    setAxisRange(runDimension, key) {
        let runMin = +runDimension.bottom(1)[0][key];
        let runMax = +runDimension.top(1)[0][key];
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
