import React, { Component } from 'react';
import dc from 'dc';
import * as d3 from 'd3';
import crossfilter from 'crossfilter';
import { Helpers } from '../helpers';
import colors from '../colors';
import '../style/style.css';

class ChartLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: 'Markdown',
            initialPieText: 'For all categories'
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        //for redraw charts on resize
        this.changeOnResize();
    }

    componentDidUpdate() {
        let chartLine = dc.lineChart('#line-chart');
        let chartPie = dc.pieChart('#pie-chart');

        let pieHeader = this.myRef.current;
        let parameter = Helpers.returnValue(this.props.parameter, 'markdown');
        let prevFilters = [];
        let dataRangeText = [];

        let ndx                         = crossfilter(this.props.csvData),
            runDimensionLinear          = ndx.dimension(function(d) {return +d.week_ref;}),
            sumGroupLinear              = runDimensionLinear.group().reduceSum(function(d) {return d[parameter];}),
            runDimensionPie             = ndx.dimension(function(d) {return d.item_category;}),
            SumGroupPie                 = runDimensionPie.group().reduceSum(function(d) {return d[parameter];});

        let categoriesOrder =[];

        chartPie
            .height((element) => Helpers.calcHeight(element))
            .innerRadius(50)
            .dimension(runDimensionPie)
            .group(SumGroupPie)
            .legend(dc.legend())
            .ordinalColors(colors)
            //workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice').text(function(d) {
                    let resultAngle = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                    if (resultAngle >= 3)
                        return dc.utils.printSingleValue(Number.parseFloat(d.data.value).toFixed(2));
                });
            })
            .on('filtered.monitor', (chart, filter) => {
                this.handleSlicesData(prevFilters, chartLine, parameter, filter);
                this.setYAxisTitle(chartLine, prevFilters, parameter);
                this.setClassToSlice(chart, prevFilters);
                this.setColorForSlices(chart, categoriesOrder, chartLine, filter);

                if (!filter) {
                    dataRangeText = [];
                    this.resetPieData(prevFilters, pieHeader, filter)
                }
                chartLine.render();
            });

        let xAxisRange = this.setAxisRange(runDimensionLinear, 'week_ref');

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
                if (dataRangeText.length)  {this.setPieTitle(['pastValue'], pieHeader, dataRangeText)}
            })
            .addFilterHandler((filters, filter) => {
                let binsIn = chartLine.group().all().filter(function(kv) {
                    return filter.isFiltered(kv.key) && kv.value;
                });
                dataRangeText = this.getDataRangeText(filter);
                this.setPieTitle(binsIn, pieHeader, dataRangeText);
                return binsIn.length ? [filter] : [];
            })
            //apply brush filter
            .brush().on('brushend.no-empty', () => {
                if(!chartLine.filters().length)
                    window.setTimeout(() => {
                        chartLine.filterAll().redraw();
                    }, 100);
            });
        dc.renderAll();
    }

    setColorForSlices(chart, categoriesOrder, chartLine, filter) {
        //push names of the groups to array that indicates current color's order
        chart.selectAll('text.pie-slice').text(function(d) {
            categoriesOrder.push(d.data.key);
        });
        //return color index that matches index in the current color array
        chartLine.colorAccessor(() => {
            return categoriesOrder.indexOf(filter)
        });
    }

    resetPieData(prevFilters, pieHeader, filter) {
        pieHeader.innerText = this.state.initialPieText;
        return filter ? prevFilters : [];
    }

    handleSlicesData(prevFilters, chartLine, parameter, filter) {
        if (~prevFilters.indexOf(filter)) {
            //remove prevFilters value if it unchecked
            prevFilters.splice(prevFilters.indexOf(filter), 1);
            if (!prevFilters.length) {
                //set initial text for Y axis if all pie slices are unchecked
                this.setYAxisTitle(chartLine, null, parameter);
            }
        } else {
            //add one filter to comparison array
            prevFilters.push(filter);
        }
    }

    setYAxisTitle(chartLine, prevFilters, parameter) {
        let isMore;
        isMore = (prevFilters) ? this.isMoreValue(prevFilters): '';
        return chartLine.yAxisLabel(`${isMore || 'All'}  ${Helpers.capitalizeFirstLetter(parameter)} Sum`);
    }

    setClassToSlice(chart, prevFilters) {
        chart.selectAll('g.pie-slice > path').attr('class', function(d) {
            if (~prevFilters.indexOf(d.data.key)) {
                return 'pie-selected';
            } else {
                return null;
            }
        });
    }

    changeOnResize() {
        window.addEventListener('resize', () => {
            dc.renderAll();
        });
    }

    isMoreValue(prevFilters) {
        return (prevFilters.length > 1) ? 'Selected' : prevFilters[0];
    }

    setAxisRange(runDimensionLinear, key) {
        let runMin = +runDimensionLinear.bottom(1)[0][key];
        let runMax = +runDimensionLinear.top(1)[0][key];
        return {runMin, runMax}
    }

    //display text in the pie header in correct range from the brush select tool in the line chart
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
            pieHeader.innerText = this.state.initialPieText;
        }
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
                                        { Helpers.capitalizeFirstLetter(Helpers.returnValue(this.props.parameter, 'markdown')) + ' Statistics' }
                                    </h4>
                                    <p className="category" ref={this.myRef}>{this.state.initialPieText}</p>
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
