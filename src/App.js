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
        this.onAnswerChangeSelect = this.onAnswerChangeSelect.bind(this);
    }

    componentDidMount() {
            d3.csv("data.csv").then((csvData) => {
                this.setState({csvData: csvData})
        });
    }

    onAnswerChangeSelect(selectedItem) {
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
                                <a href="dashboard.html">
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
                            <div className="collapse navbar-collapse">
                                <ul className="nav navbar-nav navbar-left">
                                    <li>
                                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                            <i className="fa fa-dashboard"></i>
                                            <p className="hidden-lg hidden-md">Dashboard</p>
                                        </a>
                                    </li>
                                </ul>

                                <ul className="nav navbar-nav navbar-right">

                                    <li className="dropdown">
                                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                            <p>
                                                Dropdown
                                                <b className="caret"></b>
                                            </p>

                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><a href="#">Action</a></li>
                                            <li><a href="#">Another action</a></li>
                                            <li><a href="#">Something</a></li>
                                            <li><a href="#">Another action</a></li>
                                            <li><a href="#">Something</a></li>
                                            <li className="divider"></li>
                                            <li><a href="#">Separated link</a></li>
                                        </ul>
                                    </li>

                                    <li className="separator hidden-lg"></li>
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
                            <nav className="pull-left">
                                <ul>
                                    <li>
                                        <a href="#">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            Company
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            Portfolio
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            Blog
                                        </a>
                                    </li>
                                </ul>
                            </nav>
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
