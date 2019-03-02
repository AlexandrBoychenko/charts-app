import React, { Component } from 'react';
import Charts from './components/charts';
import Dropdown from './components/dropdown'
import * as d3 from 'd3';
import dc from 'dc';

import './style/style.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: [],
            parameter: ''
        };
        this.onChangeSelect = this.onChangeSelect.bind(this);
    }

    componentDidMount() {
            d3.csv("data.csv").then((csvData) => {
                this.setState({csvData: csvData})
        });
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
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand" href="index.html">Dashboard</a>
                            </div>
                            <div className="collapse navbar-collapse">
                                <ul className="nav navbar-nav navbar-left">
                                    <li>
                                        <a href="index.html" className="dropdown-toggle" data-toggle="dropdown">
                                            <i className="fa fa-dashboard"></i>
                                        </a>
                                    </li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                    <li>
                                        <div className="div-link" onClick={this.resetAll}>
                                            <p>Reset All</p>
                                        </div>
                                    </li>

                                    <Dropdown onChangeSelect = {this.onChangeSelect} />

                                </ul>
                            </div>
                        </div>
                    </nav>

                    <Charts
                        csvData={this.state.csvData}
                        parameter={this.state.parameter}
                    />

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
