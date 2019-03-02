import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';
import { Helpers } from '../helpers';
import '../style/style.css';

class ChartLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: 'Markdown'
        }
    }

    componentDidUpdate() {
        let chartLine = dc.lineChart('#line-chart');
        let chartPie = dc.pieChart('#pie-chart');

        let parameter = Helpers.returnValue(this.props.parameter, 'markdown');

        let ndx                         = crossfilter(this.props.csvData),
            runDimensionLinear          = ndx.dimension(function(d) {return +d.week_ref;}),
            sumGroupLinear              = runDimensionLinear.group().reduceSum(function(d) {return d[parameter];}),
            runDimensionPie             = ndx.dimension(function(d) {return d.item_category;}),
            SumGroupPie                 = runDimensionPie.group().reduceSum(function(d) {return d[parameter];});

        chartLine.width((element) => Helpers.calcWidth(element, chartPie));

        chartPie
            .height(300)
            .innerRadius(50)
            .dimension(runDimensionPie)
            .group(SumGroupPie)
            .drawPaths(true)
            .legend(dc.legend().autoItemWidth(true))
            // workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', function(chart) {
                chart.selectAll('text.pie-slice').text(function(d) {
                    let resultAngle = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                    if (resultAngle >= 3)
                        return dc.utils.printSingleValue(Number.parseFloat(d.data.value).toFixed(2));
                })
            });

        let xAxisRange = this.setAxisRange(runDimensionLinear, 'week_ref');

        chartLine.width((element) => Helpers.calcWidth(element, chartLine));

        chartLine
            .height(300)
            .x(d3.scaleLinear().domain([xAxisRange.runMin, xAxisRange.runMax]))
            .margins({top: 10, right: 10, bottom: 50, left: 60})
            .xAxisLabel('Week Number')
            .yAxisLabel(`${Helpers.capitalizeFirstLetter(parameter)} Sum`)
            .renderDataPoints(true)
            .clipPadding(10)
            .dimension(runDimensionLinear)
            .group(sumGroupLinear)
            .addFilterHandler(function(filters, filter) {
                let binsIn = chartLine.group().all().filter(function(kv) {
                    return filter.isFiltered(kv.key) && kv.value;
                });
                return binsIn.length ? [filter] : [];
            })
            .brush().on('brushend.no-empty', function() {
                if(!chartLine.filters().length)
                    window.setTimeout(function() {
                        chartLine.filterAll().redraw();
                    }, 100);
            });

        dc.renderAll();
    }

    setAxisRange(runDimensionLinear, key) {
        let runMin = +runDimensionLinear.bottom(1)[0][key];
        let runMax = +runDimensionLinear.top(1)[0][key];
        return {runMin, runMax}
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">
                                        {
                                            Helpers.capitalizeFirstLetter(Helpers.returnValue(this.props.parameter, 'markdown'))
                                            + ' Statistics'}
                                    </h4>
                                    <p className="category">Last Campaign Performance</p>
                                </div>
                                <div className="content">
                                    <div id="pie-chart" className="ct-chart"></div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChartLine;
