class Helpers {
    static calcWidth (element, chart) {
        let width = element && element.getBoundingClientRect && element.getBoundingClientRect().width;
        return (width && width > chart.minWidth()) ? width : chart.minWidth();
    }
}

export { Helpers };