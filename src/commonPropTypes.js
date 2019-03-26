import PropTypes from 'prop-types';

export default {
    parameter: PropTypes.string.isRequired,
    csvData: PropTypes.array.isRequired,
    crossFilter: PropTypes.object.isRequired,
    setMemoryData: PropTypes.func.isRequired,
    getMemoryData: PropTypes.func.isRequired,
    initialPieText: PropTypes.string.isRequired,
    renderIfSelected: PropTypes.func
}