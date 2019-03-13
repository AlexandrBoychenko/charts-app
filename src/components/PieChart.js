import React, { Component } from 'react';
import dc from 'dc';
import colors from '../colors';
import { Helpers } from '../helpers';
import '../style/style.css';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        let chartPie = dc.pieChart('#pie-chart');
        let parameter = this.props.parameter;

        let runDimensionPie             = this.props.crossFilter.dimension(function(d) {return d.item_category;}),
            sumGroupPie                 = runDimensionPie.group().reduceSum(function(d) {return d[parameter];});


        chartPie
            .height((element) => Helpers.calcHeight(element))
            .innerRadius(50)
            .dimension(runDimensionPie)
            .group(sumGroupPie)
            .legend(dc.legend())
            .ordinalColors(colors)
            //workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', (chart) => {
                this.setClassToSlice(chart, prevFilters);
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
                    this.resetPieData(prevFilters, pieHeader, filter);
                    prevFilters = [];
                }
                chartLine.render();
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

    isMoreValue(prevFilters) {
        return (prevFilters.length > 1) ? 'Selected' : prevFilters[0];
    }

    resetPieData(prevFilters, pieHeader, filter) {
        pieHeader.innerText = this.state.initialPieText;
        return filter ? prevFilters : [];
    }

    render() {
        return (
            <div className="card">
                <div className="header">
                    <h4 className="title">
                        { Helpers.capitalizeFirstLetter(Helpers.returnValue(this.props.parameter, 'markdown')) + ' Statistics' }
                    </h4>
                    <p className="category" ref={this.myRef}>{this.props.initialPieText}</p>
                </div>
                <div className="content">
                    <div id="pie-chart" className="ct-chart"></div>
                </div>
            </div>
        )
    }
}

export default PieChart
