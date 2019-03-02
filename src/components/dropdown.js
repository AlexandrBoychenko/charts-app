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
            <li className="dropdown">
                <a href="index.html" className="dropdown-toggle" data-toggle="dropdown">
                    <p>
                        Select Category
                        <b className="caret"></b>
                    </p>
                </a>
                <ul className="dropdown-menu">
                    <li><a onClick={this.handleChangeSelect}>Markdown</a></li>
                    <li><a onClick={this.handleChangeSelect}>Revenues</a></li>
                    <li><a onClick={this.handleChangeSelect}>Margin</a></li>
                </ul>
            </li>
        );


    }
}

export default Dropdown
