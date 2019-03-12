import React, { Component } from 'react';
import Charts from './components/Charts';
import Dropdown from './components/Dropdown'
import * as d3 from 'd3';
import dc from 'dc';
import crossfilter from 'crossfilter';
import { Helpers } from './helpers';

import './style/style.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: null,
            parameter: 'markdown'
        };
        this.onChangeSelect = this.onChangeSelect.bind(this);
    }

    componentDidMount() {
        d3.csv("data.csv").then((csvData) => {
         this.setState({csvData: csvData});
        })
    }

    getInitData() {
        if (this.state.csvData) {
            let parameter = Helpers.returnValue(this.props.parameter, 'markdown');
            let crossFilter                 = crossfilter(this.state.csvData),
                runDimensionLinear          = crossFilter.dimension(function(d) {return +d.week_ref;}),
                sumGroupLinear              = runDimensionLinear.group().reduceSum(function(d) {return d[parameter];}),
                runDimensionPie             = crossFilter.dimension(function(d) {return d.item_category;}),
                sumGroupPie                 = runDimensionPie.group().reduceSum(function(d) {return d[parameter];});

            let csvData = this.state.csvData;
            return <Charts
                parameter={this.state.parameter}
                {...{runDimensionLinear, sumGroupLinear, runDimensionPie, sumGroupPie}}
            />
        }
    }

    onChangeSelect(selectedItem) {
        this.setState({parameter: selectedItem});
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
