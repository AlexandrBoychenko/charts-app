import React, { Component } from 'react';
import '../style/style.css';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.handleChangeSelect = this.handleChangeSelect.bind(this)
    }

    componentDidMount() {}

    handleChangeSelect(e) {
        this.props.onChangeSelect(e.target.textContent.toLowerCase());
    }

    render() {
        return (
            <li className="dropdown">
                <a href="index.html" className="dropdown-toggle" data-toggle="dropdown">
                    <p className="inner-list-item">
                        Select Category
                        <b className="caret"></b>
                    </p>
                </a>
                <ul className="dropdown-menu">
                    <li><div className="div-link" onClick={this.handleChangeSelect}>Markdown</div></li>
                    <li><div className="div-link" onClick={this.handleChangeSelect}>Revenues</div></li>
                    <li><div className="div-link" onClick={this.handleChangeSelect}>Margin</div></li>
                </ul>
            </li>
        );
    }
}

export default Dropdown
