import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
// temporarily use my local version, hopefully my pr is accepted
// import PlacesAutocomplete from 'react-places-autocomplete-kl';
require('Sass/components/stops/Search.scss');

export default class Search extends React.Component {
    static propTypes = {
        address: PropTypes.string.isRequired,
        onSuggestChange: PropTypes.func.isRequired,
        onSuggestSelect: PropTypes.func.isRequired,
        onClearSearchClick: PropTypes.func.isRequired,
        onSearchFocus: PropTypes.func,
        onSearchBlur: PropTypes.func,
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
            root: 'stops-search-wrapper',
            input: 'stops-search-input',
            autocompleteContainer: 'stops-search-container',
        };
    }

    renderLocateButton() {
        const { onGetCurrentLocClick } = this.props;
        return (
            <div role="button"
                className="locate-btn"
                onClick={onGetCurrentLocClick}>
                <i className="icon ion-android-locate"></i>
            </div>
        );
    }

    renderClearButton() {
        const { address, onClearSearchClick } = this.props;
        return (
            address ?
                <i className="icon ion-close" onClick={onClearSearchClick}></i>
                : null
        );
    }

    renderAutoComplete() {
        const props = this.props;
        const autoCompleteItem = this.renderItem();

        return (
            <PlacesAutocomplete
                value={props.address}
                onFocus={props.onSearchFocus}
                onBlur={props.onSearchBlur}
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
        const locateButton = this.renderLocateButton();
        const clearButton = this.renderClearButton();
        const autoComplete = this.renderAutoComplete();

        return (
            <div className="search">
                {locateButton}
                {autoComplete}
                {clearButton}
            </div>
        );
    }
}
