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
            parameter: 'Markdown',
            initialPieText: 'For all categories'
        };
        this.myRef = React.createRef();
    }



    componentDidUpdate() {
        let chartLine = dc.lineChart('#line-chart');
        let chartPie = dc.pieChart('#pie-chart');

        let pieHeader = this.myRef.current;
        let parameter = Helpers.returnValue(this.props.parameter, 'markdown');

        let ndx                         = crossfilter(this.props.csvData),
            runDimensionLinear          = ndx.dimension(function(d) {return +d.week_ref;}),
            sumGroupLinear              = runDimensionLinear.group().reduceSum(function(d) {return d[parameter];}),
            runDimensionPie             = ndx.dimension(function(d) {return d.item_category;}),
            SumGroupPie                 = runDimensionPie.group().reduceSum(function(d) {return d[parameter];});

        let pieValues = SumGroupPie.all().map(function(d) { return d.key });
        let colors = ['rgb(43, 137, 9)', 'rgb(239, 2, 2)', 'rgb(8, 24, 145)', 'rgb(56, 119, 91)'];
        let currentColor = colors[this.choseColor(parameter)];
        let currentCategory;

        chartPie
            .height((element) => Helpers.calcHeight(element))
            .innerRadius(50)
            .dimension(runDimensionPie)
            .group(SumGroupPie)
            .drawPaths(true)
            .legend(dc.legend())
            //workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', function(chart) {
                chart.selectAll('text.pie-slice').text(function(d) {
                    let resultAngle = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                    currentCategory = d.data.key;
                    chartLine.colorAccessor(() => {return pieValues.indexOf(currentCategory)});
                    if (resultAngle >= 3)
                        return dc.utils.printSingleValue(Number.parseFloat(d.data.value).toFixed(2));
                })
            });

        let xAxisRange = this.setAxisRange(runDimensionLinear, 'week_ref');

        chartLine
            .height((element) => Helpers.calcHeight(element))
            .x(d3.scaleLinear().domain([xAxisRange.runMin, xAxisRange.runMax]))
            .margins({top: 10, right: 10, bottom: 50, left: 60})
            .xAxisLabel('Week Number')
            .yAxisLabel(`Common ${Helpers.capitalizeFirstLetter(parameter)} Sum`)
            .renderDataPoints(true)
            .clipPadding(10)
            .dimension(runDimensionLinear)
            .group(sumGroupLinear)
            //.colors(colors)
            .colorAccessor(/*{ return this.choseColor(parameter) }*/
                (d, i) => {
                    let indexCategory = pieValues.indexOf(this.props.csvData[i].item_category);
                    if (indexCategory && currentCategory) {
                        return pieValues.indexOf(currentCategory);
                    } else {
                        return this.choseColor(parameter);
                    }
                })
            .colorDomain ([0,3])
            .addFilterHandler((filters, filter) => {
                let binsIn = chartLine.group().all().filter(function(kv) {
                    return filter.isFiltered(kv.key) && kv.value;
                });
                this.handlePieText(filter, binsIn, pieHeader)

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
        this.changeAxisLabelColor(currentColor);

        //for redraw charts on resize
        this.changeOnResize(currentColor);
    }

    changeOnResize(currentColor) {
        window.addEventListener('resize', () => {
            dc.renderAll();
            this.changeAxisLabelColor(currentColor);
        });
    }

    changeAxisLabelColor(currentColor) {
        d3.select('.y-axis-label').style('fill', currentColor);
    }

    choseColor(parameter) {
        switch (parameter) {
            case 'markdown': return 0;
            case 'revenues': return 1;
            case 'margin': return 2;
            default: return 3;
        }
    }

    setAxisRange(runDimensionLinear, key) {
        let runMin = +runDimensionLinear.bottom(1)[0][key];
        let runMax = +runDimensionLinear.top(1)[0][key];
        return {runMin, runMax}
    }

    handlePieText(filter, binsIn, pieHeader) {
        let firstValue = Math.ceil(filter[0]);
        let secondValue = Math.floor(filter[filter.length - 1]);
        let dataRangeText = (filter.length === 1) ? firstValue : firstValue + ' - ' + secondValue;

        if (binsIn.length) {
            pieHeader.innerText = 'Weeks: ' + dataRangeText;
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
