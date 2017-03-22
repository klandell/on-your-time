import React, { PropTypes } from 'react';
import Geosuggest from 'react-geosuggest';
import StopsList from 'Components/stops/StopsList';

export default class StopsView extends React.Component {
    static propTypes = {
        address: PropTypes.string.isRequired,
        onSuggestSelect: PropTypes.func.isRequired,
        onClearSearchClick: PropTypes.func.isRequired,
        stops: PropTypes.array.isRequired,
        onStopItemClick: PropTypes.func.isRequired,
    }

    render() {
        const props = this.props;
        const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.477399, -74.259090),
            new google.maps.LatLng(40.917577, -73.700272),
        );

        return (
            <div class="stops">
                <i class="icon ion-close" onClick={() => props.onClearSearchClick()}></i>
                <Geosuggest
                    initialValue={props.address}
                    bounds={bounds}
                    onSuggestSelect={suggest => props.onSuggestSelect(suggest)}/>
                <StopsList
                    stops={props.stops}
                    onStopItemClick={e => props.onStopItemClick(e)} />
            </div>
        );
    }
}

// stopItems.unshift(<li>
//    <input type="text" placeholder="Search"/>
//    <i onClick={e => this.getCurrentLocation(e)} class="icon ion-android-locate"></i>
// </li>);
// </
