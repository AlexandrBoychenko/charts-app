import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';

class Charts extends Component {
    componentDidMount() {
        let chart = dc.pieChart('#pie-chart');
        d3.csv("data.csv").then(function(csvItems) {
            let ndx = crossfilter(csvItems),
                runDimension  = ndx.dimension(function(d) {return "run-"+d.markdown;}),
                markdownSumGroup = runDimension.group().reduceSum(function(d) {return d.markdown;});
            chart
                .width(768)
                .height(480)
                .slicesCap(4)
                .innerRadius(100)
                .dimension(runDimension)
                .group(markdownSumGroup)
                .legend(dc.legend())
                // workaround for #703: not enough data is accessible through .label() to display percentages
                .on('pretransition', function(chart) {
                    chart.selectAll('text.pie-slice').text(function(d) {
                        return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
                    })
                });
            chart.render();
        });
    }
    render() {
        return (
            <div className="Charts">
                <header className="Charts-header">
                    <p>
                        Charts for retail
                    </p>
                    <div id="pie-chart"></div>
                    <div id="move-chart"></div>
                </header>
            </div>
        );
    }
}

export default Charts;
