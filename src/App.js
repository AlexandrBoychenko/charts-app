import React, { Component } from 'react';
import Dropdown from './components/Dropdown'
import * as d3 from 'd3';
import dc from 'dc';
import crossfilter from 'crossfilter';
import PieChart from './components/PieChart';
import LineChart from './components/LineChart';

import './style/style.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: null,
            parameter: 'markdown',
            prevFilters: [],
            categoriesOrder: [],
            dataRangeText: [],
            pieHeader: {},
            selected: true
        };
        this.onChangeSelect = this.onChangeSelect.bind(this);
        this.setMemoryData = this.setMemoryData.bind(this);
        this.getMemoryData = this.getMemoryData.bind(this);
        this.setPieHeader = this.setPieHeader.bind(this);
        this.setChartLine = this.setChartLine.bind(this);
        this.isSelected = this.isSelected.bind(this);
    }

    componentDidMount() {
        d3.csv("data.csv").then((csvData) => {
         this.setState({csvData: csvData});
        });
        this.changeOnResize();
    }

    changeOnResize() {
        window.addEventListener('resize', () => {
            dc.renderAll();
        });
    }

    getInitData() {
        if (this.state.csvData) {
            let crossFilter = crossfilter(this.state.csvData);

            return(

                    <div className="row">

                        <div className="col-md-6">
                            <PieChart
                                parameter={this.props.parameter}
                                csvData={this.state.csvData}
                                crossFilter={crossFilter}
                                setMemoryData={this.setMemoryData}
                                getMemoryData={this.getMemoryData}
                                setPieHeader={this.setPieHeader}
                                initialPieText='For all categories'
                                chartLine={this.state.chartLine}
                                selected={this.state.selected}
                                isSelected={this.isSelected}/>
                        </div>

                        <div className="col-md-6">
                            <LineChart
                                parameter={this.props.parameter}
                                csvData={this.state.csvData}
                                crossFilter={crossFilter}
                                setMemoryData={this.setMemoryData}
                                getMemoryData={this.getMemoryData}
                                pieHeader={this.state.pieHeader}
                                initialPieText='For all categories'
                                setChartLine={this.setChartLine}
                                selected={this.state.selected}
                                isSelected={this.isSelected}/>
                        </div>

                    </div>

            )
        }
    }

    onChangeSelect(selectedItem) {
        this.setState({parameter: selectedItem});
        this.setState({selected: true});
    }

    isSelected(value) {
        this.setState({selected: value});
    }

    setMemoryData(property, value) {
        switch(property) {
            case 'prevFilters':
                return this.setState({
                    prevFilters: value
                });
            case 'categoriesOrder':
                return this.setState({
                    categoriesOrder: value
                });
            default:
                return this.setState({
                    dataRangeText: value
                });
        }
    }

    getMemoryData(property) {
        switch(property) {
            case 'prevFilters':
                return this.state.prevFilters;
            case 'categoriesOrder':
                return this.state.categoriesOrder;
            default:
                return this.state.dataRangeText;
        }
    }

    setPieHeader(value) {
        return this.setState({
            pieHeader: value
        });
    }

    setChartLine(value) {
        return this.setState({
            chartLine: value
        });
    }

    resetAll() {
        dc.filterAll();
        dc.renderAll();
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    {this.getInitData()}
                </div>
            </div>
        );
    }
}

export default App;
