import React, { PropTypes } from 'react';
// import Geosuggest from 'react-geosuggest';
import PlacesAutocomplete from 'react-places-autocomplete';

import StopsList from 'Components/stops/StopsList';

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
        const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.477399, -74.259090),
            new google.maps.LatLng(40.917577, -73.700272),
        );
        const options = { // TODO: not working
            bounds,
        };

        const cssClasses = {
            root: 'form-group',
            label: 'form-label',
            input: 'search-input',
            autocompleteContainer: 'search-container',
        };

        const AutocompleteItem = ({ formattedSuggestion }) => (
              <div className="suggestion-item">
                <i className='icon ion-location'/>
                <strong>{formattedSuggestion.mainText}</strong>
                <br />
                <small className="text-muted">{formattedSuggestion.secondaryText}</small>
              </div>);

        return (
            <div class="stops">
                <i class="icon ion-close" onClick={props.onClearSearchClick}></i>
                <PlacesAutocomplete
                    value={props.address}
                    onChange={props.onSuggestChange}
                    onSelect={props.onSuggestSelect}
                    options={options}
                    onSelect={props.onSuggestSelect}
                    classNames={cssClasses}
                    autocompleteItem={AutocompleteItem}
                    placeholder="Search Places"
                    hideLabel={true}
                    inputName="places-input"
                    onEnterKeyDown={props.onSuggestSelect}/>
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
