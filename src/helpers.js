class Helpers {
    static calcWidth(element, chart) {
        let width = element && element.getBoundingClientRect && element.getBoundingClientRect().width;
        return (width && width > chart.minWidth()) ? width : chart.minWidth()
    }

    static capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1)
    }

    static returnValue(string, defaultString) {
        return !!string ? string : defaultString
    }
}

export { Helpers };