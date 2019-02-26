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
                <div className="Charts">
                    <header className="charts-header">
                        <h1 className="main-title">
                            Charts for retail
                        </h1>
                    </header>
                    <div className="main-content">
                        {/*<ChartPie csvData={this.state.csvData}/>*/}
                        <ChartLine csvData={this.state.csvData}/>
                    </div>
                </div>
            );


    }
}

export default App;
