import React, { Component } from 'react';
import dc from 'dc';
import { Helpers } from '../helpers';
import colors from '../colors';
import '../style/style.css';
import crossfilter from 'crossfilter';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        let crossFilter                 = crossfilter(this.props.csvData),
            runDimensionPie             = crossFilter.dimension(function(d) {return d.item_category;}),
            sumGroupPie                 = runDimensionPie.group().reduceSum(function(d) {return d[this.props.parameter];});

        let chartPie = dc.pieChart('#pie-chart');

        chartPie
            .height((element) => Helpers.calcHeight(element))
            .innerRadius(50)
            .dimension(runDimensionPie)
            .group(sumGroupPie)
            .legend(dc.legend())
            .ordinalColors(colors);

        dc.renderAll();
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
