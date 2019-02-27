import React, { Component } from 'react';
import dc from 'dc';
import crossfilter from 'crossfilter';
import '../style/style.css';

class ChartPie extends Component {

    runChart() {
        let chart = dc.pieChart('#pie-chart');
        let ndx                 = crossfilter(this.props.csvData),
            runDimension        = ndx.dimension(function(d) {return d.item_category;}),
            markdownSumGroup    = runDimension.group().reduceSum(function(d) {return d.markdown;});

        chart.width(function (element) {
            let width = element && element.getBoundingClientRect && element.getBoundingClientRect().width * 0.8;
            return (width && width > chart.minWidth()) ? width : chart.minWidth();
        });

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
    }

    render() {
        this.runChart();
        return <div id="pie-chart">
            <p className="chart-name">Pie Chart</p>
        </div>
    }
}

export default ChartPie;
