import React, { Component } from 'react';

import '../style/style.css';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.handleChangeSelect = this.handleChangeSelect.bind(this)
    }

    componentDidMount() {}

    handleChangeSelect(e) {
        this.props.onAnswerChangeSelect(e.target.textContent.toLowerCase());
    }

    render() {
        return (
            <div className="col-md-2 header-controls">
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">Parameter
                        <span className="caret"></span></button>
                    <ul
                        className="dropdown-menu"
                        role="menu"
                        aria-labelledby="menu1">
                        <li role="presentation" onClick={this.handleChangeSelect}>Markdown</li>
                        <li role="presentation" onClick={this.handleChangeSelect}>Revenues</li>
                        <li role="presentation" onClick={this.handleChangeSelect}>Margin</li>
                    </ul>
                </div>
            </div>
        );


    }
}

export default Dropdown
