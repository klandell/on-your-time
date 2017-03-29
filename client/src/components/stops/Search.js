import React, { PropTypes } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

export default class Search extends React.Component {
    static propTypes = {
        address: PropTypes.string.isRequired,
        onSuggestChange: PropTypes.func.isRequired,
        onSuggestSelect: PropTypes.func.isRequired,
    }

    get options() {
        const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.477399, -74.259090),
            new google.maps.LatLng(40.917577, -73.700272),
        );
        return { bounds };
    }

    get cssClasses() {
        return {
            root: 'form-group',
            label: 'form-label',
            input: 'search-input',
            autocompleteContainer: 'search-container',
        };
    }

    renderItem() {
        return ({ formattedSuggestion }) => (
            <div className="suggestion-item">
                <i className='icon ion-location'/>
                <strong>{formattedSuggestion.mainText}</strong>
                <br />
                <small className="text-muted">{formattedSuggestion.secondaryText}</small>
            </div>
        );
    }

    render() {
        const props = this.props;
        const autoCompleteItem = this.renderItem();

        return (
            <PlacesAutocomplete
                value={props.address}
                onChange={props.onSuggestChange}
                onSelect={props.onSuggestSelect}
                options={this.options}
                classNames={this.cssClasses}
                autocompleteItem={autoCompleteItem}
                placeholder="Search Places"
                hideLabel={true}
                inputName="places-input"
                onEnterKeyDown={props.onSuggestSelect} />
        );
    }
}
