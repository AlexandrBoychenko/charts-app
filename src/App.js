import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';
import './App.css';
import './index.css';

class App extends Component {
    componentDidMount() {
        let chart = dc.pieChart('#pie-chart');
        d3.csv("data.csv").then(function(csvItems) {
            let ndx = crossfilter(csvItems),
                runDimension  = ndx.dimension(function(d) {return d.item_category;}),
                markdownSumGroup = runDimension.group().reduceSum(function(d) {return d.markdown;});
            chart
                .width(768)
                .height(480)
                .innerRadius(100)
                .dimension(runDimension)
                .group(markdownSumGroup)
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
            chart.render();
        });
    }
    render() {
        return (
            <div className="Charts">
              <header className="Charts-header">
                <h1>
                  Charts for retail
                </h1>
                <div id="pie-chart"></div>
                <div id="move-chart"></div>
              </header>
            </div>
        );
    }
}

export default App;
