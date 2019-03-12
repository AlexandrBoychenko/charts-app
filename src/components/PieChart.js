import React, { Component } from 'react';
import dc from 'dc';
import { Helpers } from '../helpers';
import colors from '../colors';
import '../style/style.css';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        // let chartPie = this.props.chartPie;
        //let chartLine = this.props.chartLine;
        let chartPie = dc.pieChart('#pie-chart');

        let pieHeader = this.myRef.current;
        let parameter = Helpers.returnValue(this.props.parameter, 'markdown');
        console.log(this.props.runDimensionPie, this.props.sumGroupPie);

        chartPie
            .height((element) => Helpers.calcHeight(element))
            .innerRadius(50)
            .dimension(this.props.runDimensionPie)
            .group(this.props.sumGroupPie)
            .legend(dc.legend())
            .ordinalColors(colors)
            //workaround for #703: not enough data is accessible through .label() to display percentages
            .on('pretransition', (chart) => {
                this.setClassToSlice(chart, this.props.parentState.prevFilters);
                chart.selectAll('text.pie-slice').text(function(d) {
                    let resultAngle = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                    if (resultAngle >= 3)
                        return dc.utils.printSingleValue(Number.parseFloat(d.data.value).toFixed(2));
                });
            })
            .on('filtered.monitor', (chart, filter) => {
                /*this.handleSlicesData(this.state.prevFilters, chartLine, parameter, filter);
                this.setYAxisTitle(chartLine, this.state.prevFilters, parameter);
                this.setClassToSlice(chart, this.state.prevFilters);
                this.setColorForLine(chart, this.state.categoriesOrder, chartLine, filter);*/

                if (!filter) {
                    this.props.setArrayValues('dataRangeText', []);
                    this.resetPieData(this.props.prevFilters, pieHeader, filter);
                    this.props.setArrayValues('prevFilters', []);
                }
                // chartLine.render();
            });
        dc.renderAll();
    }

    setYAxisTitle(chartLine, prevFilters, parameter) {
        let isMore;
        isMore = (prevFilters) ? this.isMoreValue(prevFilters): '';
        return chartLine.yAxisLabel(`${isMore || 'All'}  ${Helpers.capitalizeFirstLetter(parameter)} Sum`);
    }

    setColorForLine(chart, categoriesOrder, chartLine, filter) {
        //push names of the groups to array that indicates current color's order
        chart.selectAll('text.pie-slice').text(function(d) {
            categoriesOrder.push(d.data.key);
        });
        //return color index that matches index in the current color array
        chartLine.colorAccessor(() => {
            return categoriesOrder.indexOf(filter)
        });
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

    resetPieData(prevFilters, pieHeader, filter) {
        pieHeader.innerText = this.props.initialPieText;
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
