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
                    <div className="container">

                        <div className="row">
                            <div className="col-md-3">
                                <div className="media">
                                    <img className="ml-5 header-img" src="img/the-official-chart-logo.png" alt=""/>
                                </div>
                            </div>

                            <div className="col-md-1"></div>

                            <div className="col-md-4 header-controls">
                                 <p>Select category to display in charts:</p>
                            </div>

                            <Dropdown onAnswerChangeSelect={this.onAnswerChangeSelect}/>

                            <div className="col-md-1 header-controls">
                                <a href="default.html" className="reset" onClick={this.resetAll()}>Reset All</a>
                            </div>
                        </div>

                        <Charts
                            csvData={this.state.csvData}
                            parameter={this.state.parameter}
                        />
                    </div>
            );


    }
}

export default App;
