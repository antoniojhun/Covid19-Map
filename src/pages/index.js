import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';

import { promiseToFlyTo, geoJsonToMarkers, clearMapLayers } from 'lib/map';
import {
	trackerLocationsToGeoJson,
	trackerFeatureToHtmlMarker,
} from 'lib/coronavirus';
import { useCoronavirusTracker } from 'hooks';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
	lat: -25.068213,
	lng: 133.970781,
};

const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 5;

const IndexPage = () => {
	const { data = {} } = useCoronavirusTracker({
		api: 'locations',
	});
	const { locations = [] } = data || {};
	// const hasData = Array.isArray(data) && data.length > 0;

	/**
	 * mapEffect
	 * @description Fires a callback once the page renders
	 * @example Here this is and example of being used to zoom in and set a popup on load
	 */

	async function mapEffect({ leafletElement: map } = {}) {
		if (!map || locations.length === 0) return;
		// if (!map || !hasData) return;

		clearMapLayers({
			map,
			excludeByName: ['OpenStreetMap'],
		});

		const locationsGeoJson = trackerLocationsToGeoJson(locations);

		const locationsGeoJsonLayers = geoJsonToMarkers(locationsGeoJson, {
			onClick: handleOnMarkerClick,
			featureToHtml: trackerFeatureToHtmlMarker,
		});

		const bounds = locationsGeoJsonLayers.getBounds();

		locationsGeoJsonLayers.addTo(map);

		map.fitBounds(bounds);
	}

	function handleOnMarkerClick({ feature = {} } = {}, event = {}) {
		const { target = {} } = event;
		const { _map: map = {} } = target;

		const { geometry = {}, properties = {} } = feature;
		const { coordinates } = geometry;
		const { countryBounds, country_code: countryCode } = properties;

		const boundsGeoJsonLayer = new L.GeoJSON(countryBounds);
		const boundsGeoJsonLayerBounds = boundsGeoJsonLayer.getBounds();

		promiseToFlyTo(map, {
			center: {
				lat: coordinates[1],
				lng: coordinates[0],
			},
			zoom: 7,
		});

		if (countryCode !== 'AU') {
			map.fitBounds(boundsGeoJsonLayerBounds);
		}
	}

	const mapSettings = {
		center: CENTER,
		defaultBaseMap: 'OpenStreetMap',
		zoom: DEFAULT_ZOOM,
		mapEffect,
	};

	return (
		<Layout pageName="home">
			<Helmet>
				<title>Home Page</title>
			</Helmet>

			<Map {...mapSettings} />

			<Container type="content" className="text-center home-start">
				<h2>Coronavirus(COVID-19) Map</h2>
				<ul>
					<li>
						Data source: <b>JHU CSSE</b>
						<br /> Worldwide Data repository operated by the Johns Hopkins
						University Center for Systems Science and Engineering.
						<br /> API:{' '}
						<a
							href="https://github.com/ExpDev07/coronavirus-tracker-api"
							target="_blank"
							rel="noopener noreferrer"
						>
							github.com/ExpDev07/coronavirus-tracker-api
						</a>
					</li>
				</ul>

				<h2>Stay Home</h2>
			</Container>
		</Layout>
	);
};

export default IndexPage;
