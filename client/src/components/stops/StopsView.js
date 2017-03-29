import React, { PropTypes } from 'react';
import StopsList from 'Components/stops/StopsList';
import Search from 'Components/stops/Search';

export default class StopsView extends React.Component {
    static propTypes = {
        address: PropTypes.string.isRequired,
        onSuggestChange: PropTypes.func.isRequired,
        onSuggestSelect: PropTypes.func.isRequired,
        onClearSearchClick: PropTypes.func.isRequired,
        stops: PropTypes.array.isRequired,
        loadCount: PropTypes.number.isRequired,
        onStopItemClick: PropTypes.func.isRequired,
        onMoreClick: PropTypes.func.isRequired,
    }

    render() {
        const props = this.props;

        return (
            <div class="stops">
                <i class="icon ion-close" onClick={props.onClearSearchClick}></i>
                <Search
                    onSuggestChange={props.onSuggestChange}
                    onSuggestSelect={props.onSuggestSelect}
                    address={props.address} />
                <StopsList
                    stops={props.stops}
                    loadCount={props.loadCount}
                    onStopItemClick={props.onStopItemClick}
                    onMoreClick={props.onMoreClick} />
            </div>
        );
    }
}

// stopItems.unshift(<li>
//    <input type="text" placeholder="Search"/>
//    <i onClick={e => this.getCurrentLocation(e)} class="icon ion-android-locate"></i>
// </li>);
// </
