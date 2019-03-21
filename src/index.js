import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Dropdown from './components/Dropdown';


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: 'markdown'
        };
        this.onChangeSelect = this.onChangeSelect.bind(this);
    }

    onChangeSelect(selectedItem) {
        this.setState({parameter: selectedItem});
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

                    <App parameter={this.state.parameter}/>

                    <footer className="footer">
                        <div className="container-fluid">
                            <p className="copyright pull-right">
                                &copy; <script>document.write(new Date().getFullYear())</script> <a href="http://www.creative-tim.com">Creative Tim</a>, made with love for a better web
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));
