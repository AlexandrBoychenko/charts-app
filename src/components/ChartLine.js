import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';
import { Helpers } from '../helpers';
import '../style/style.css';

class ChartLine extends Component {
    componentDidUpdate() {
        let chart = dc.lineChart('#line-chart');

        let ndx                 = crossfilter(this.props.csvData),
            runDimension        = ndx.dimension(function(d) {return +d.week_ref;}),
            speedSumGroup       = runDimension.group().reduceSum(function(d) {return d.markdown;});

        let xAxisRange = this.setAxisRange(runDimension, 'week_ref');

        chart.width((element) => Helpers.calcWidth(element, chart));

        chart
            .height(480)
            .x(d3.scalePow().domain([xAxisRange.runMin, xAxisRange.runMax]))
            .margins({top: 10, right: 70, bottom: 50, left: 70})
            .brushOn(false)
            .xAxisLabel('Time')
            .yAxisLabel('Markdown Sum')
            .renderArea(true)
            .renderDataPoints(true)
            .clipPadding(10)
            .dimension(runDimension)
            .group(speedSumGroup);
        chart.render();
    }

    setAxisRange(runDimension, key) {
        let runMin = +runDimension.bottom(1)[0][key];
        let runMax = +runDimension.top(1)[0][key];
        return {runMin, runMax}
    }

    render() {
        return (
            <div id="line-chart">
                <p className="chart-name">Line Chart</p>
            </div>
        );
    }
}

export default ChartLine;
