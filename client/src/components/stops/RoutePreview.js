import React, { PropTypes } from 'react';
require('Sass/components/stops/RoutePreview.scss');

export default class RoutePreview extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        stopId: PropTypes.string.isRequired,
    }

    mapRoutes(routes) {
        const stopId = this.props.stopId;

        return routes.map((route) => {
            let rte = route;

            if (rte === 'GS' || rte === 'FS') {
                rte = 'S';
            } else if (rte === 'SI') {
                rte = 'SIR';
            } else if (rte === 'H' || rte.slice(-1) === 'X') {
                rte = null;
            }

            return rte ? <div
                key={`${stopId}-${rte}`}
                className={`line line-${rte}`}>{rte}
            </div> : null;
        });
    }

    render() {
        const routes = this.mapRoutes(this.props.routes.sort());
        return <div className="route-preview">{routes}</div>;
    }
}
