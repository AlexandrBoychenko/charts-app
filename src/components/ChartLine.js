import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';
import '../style/style.css';

class ChartLine extends Component {
    runChart() {
        let chart = dc.lineChart('#line-chart');

        let ndx                 = crossfilter(this.props.csvData),
            runDimension        = ndx.dimension(function(d) {return +d.week_ref;}),
            speedSumGroup       = runDimension.group().reduceSum(function(d) {return +d.markdown;});
        chart
            .width(768)
            .height(480)
            .x(d3.scaleLinear().domain([0,52]))
            .renderArea(true)
            .brushOn(false)
            .renderDataPoints(true)
            .clipPadding(10)
/*
            .yAxisLabel("This is the Y Axis!")
*/
            .dimension(runDimension)
            .group(speedSumGroup);
        chart.render();
    }
    render() {
        this.runChart();
        return (<div id="line-chart">Line chart</div>);
    }
}

export default ChartLine;
