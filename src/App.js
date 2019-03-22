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
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">

                            <div className="col-md-6">
                                <PieChart
                                    parameter={this.state.parameter}
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
                                    parameter={this.state.parameter}
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
            <div className="wrapper">
                <div className="sidebar" data-color="purple" data-image="assets/img/sidebar-5.jpg">
                    <div className="sidebar-wrapper">
                        <div className="logo">
                            <a href="http://www.creative-tim.com" className="simple-text">
                                Creative Tim
                            </a>
                        </div>

                        <ul className="nav">
                            <li className="active">
                                <a href="index.html">
                                    <i className="pe-7s-graph"></i>
                                    <p>Dashboard</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="main-panel">
                    <nav className="navbar navbar-default navbar-fixed">
                        <div className="container-fluid container-header">
                            <div className="navbar-header">
                                <a className="navbar-brand" href="index.html">Statistics Dashboard</a>
                            </div>
                            <div className="header-item-right">
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <div className="div-link" onClick={this.resetAll}>
                                            <p className="inner-list-item">Reset All</p>
                                        </div>
                                    </li>

                                    <Dropdown onChangeSelect = {this.onChangeSelect} />

                                </ul>
                            </div>
                        </div>
                    </nav>

                    {this.getInitData()}

                    <footer className="footer">
                        <div className="container-fluid">
                            <p className="copyright pull-right">
                                &copy; <script>document.write(new Date().getFullYear())</script> <a href="http://www.creative-tim.com">Creative Tim</a>, made with love for a better web
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default App;
