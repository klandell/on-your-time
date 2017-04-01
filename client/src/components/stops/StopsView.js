import React, { PropTypes } from 'react';
import StopsList from 'Components/stops/StopsList';
import Search from 'Components/stops/Search';
require('Sass/components/stops/StopsView.scss');

export default class StopsView extends React.Component {
    static propTypes = {
        address: PropTypes.string.isRequired,
        onGetCurrentLocClick: PropTypes.func.isRequired,
        onSuggestChange: PropTypes.func.isRequired,
        onSuggestSelect: PropTypes.func.isRequired,
        onClearSearchClick: PropTypes.func.isRequired,
        stops: PropTypes.array.isRequired,
        loadCount: PropTypes.number.isRequired,
        onStopItemClick: PropTypes.func.isRequired,
        onMoreClick: PropTypes.func.isRequired,
        onSearchFocus: PropTypes.func,
        onSearchBlur: PropTypes.func,
    }

    render() {
        const props = this.props;

        return (
            <div className="stops">
                <Search
                    onGetCurrentLocClick={props.onGetCurrentLocClick}
                    onSuggestChange={props.onSuggestChange}
                    onSuggestSelect={props.onSuggestSelect}
                    onSearchFocus={props.onSearchFocus}
                    onSearchBlur={props.onSearchBlur}
                    address={props.address}
                    onClearSearchClick={props.onClearSearchClick} />
                <StopsList
                    stops={props.stops}
                    loadCount={props.loadCount}
                    onStopItemClick={props.onStopItemClick}
                    onMoreClick={props.onMoreClick} />
            </div>
        );
    }
}
