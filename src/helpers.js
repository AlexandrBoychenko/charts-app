class Helpers {

    //Set height for desktop or mobile
    static calcHeight(element) {
        let width = element && element.getBoundingClientRect && element.getBoundingClientRect().width;
        return (width && width < 400) ? 200 : 300
    }

    static capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1)
    }

    static returnValue(string, defaultString) {
        return !!string ? string : defaultString
    }
}

export { Helpers };