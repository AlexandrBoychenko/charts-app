import React, { Component } from 'react';
import ChartPie from './components/ChartPie';
import ChartLine from './components/ChartLine';
import * as d3 from 'd3';

import './style/style.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvData: []
        }
    }

    componentDidMount() {
            d3.csv("data.csv").then((csvData) => {
                this.setState({csvData: csvData})
        });
    }
    render() {
            return (
                    <div className="container">

                        <div className="row">
                            <div className="col-md-3">
                                <div className="media">
                                    <img className="ml-5 header-img" src="img/the-official-chart-logo.png" alt=""/>
                                </div>
                            </div>

                            <div className="col-md-1"></div>

                            <div className="col-md-5 header-controls">
                                 <p>Select category to display in charts:</p>
                            </div>

                            <div className="col-md-2 header-controls">
                                <div className="dropdown">
                                    <button className="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">Tutorials
                                        <span className="caret"></span></button>
                                    <ul className="dropdown-menu" role="menu" aria-labelledby="menu1">
                                        <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">HTML</a></li>
                                        <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">CSS</a></li>
                                        <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">JavaScript</a></li>
                                        <li role="presentation" className="divider"></li>
                                        <li role="presentation"><a role="menuitem" tabIndex="-1" href="#">About Us</a></li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        <div className="row">

                            <div className="col-md-7">

                                <ChartPie csvData={this.state.csvData}/>

                            </div>

                            <div className="col-md-5">

                                <ChartLine csvData={this.state.csvData}/>

                            </div>

                        </div>

                    </div>

                   /*<div className="Charts">
                        <header className="charts-header">
                            <h1 className="main-title">
                                Charts for retail
                            </h1>
                        </header>
                        <div className="main-content">


                        </div>
                    </div>*/
            );


    }
}

export default App;
