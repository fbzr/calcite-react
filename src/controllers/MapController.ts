import { RefObject } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureWidget from '@arcgis/core/widgets/Feature';
import applicationJSON from '../config/application.json';
import store from '../store';
import {
  setLoading,
  setSelectedObjectId,
  setTitle,
} from '../store/slices/appSlice';
import Feature from '@arcgis/core/widgets/Feature';

class MapController {
  #map?: Map;
  #mapView?: MapView;
  #featureLayer?: FeatureLayer;
  #featureWidget?: Feature;

  initialize = (viewRef: RefObject<HTMLDivElement>) => {
    if (!viewRef.current) return;

    const { webmap, portalUrl, layerId } = applicationJSON;

    this.#map = new WebMap({
      portalItem: {
        id: webmap,
      },
    });

    this.#mapView = new MapView({
      map: this.#map,
      container: viewRef.current,
    });

    this.#mapView.when().then(async (view) => {
      store.dispatch(setTitle(view.map.portalItem.title));

      const loadedMap = await (view.map as __esri.WebMap).loadAll();

      // disable layer popup
      const fLayer = loadedMap.allLayers.find(
        (layer) => layer.id === layerId
      ) as __esri.FeatureLayer;
      fLayer.outFields = ['*'];
      this.#featureLayer = await fLayer.load();
      fLayer.popupEnabled = false;

      this.#mapView?.on('click', (e) => {
        this.#mapView
          ?.hitTest(e, { include: this.#featureLayer })
          .then((response) => {
            if (response.results.length) {
              const { graphic, mapPoint } = response.results[0];

              const { attributes } = graphic;
              store.dispatch(setSelectedObjectId(attributes.OBJECTID));
            }
          });
      });
      store.dispatch(setLoading(false));
    });
  };

  initializeFeatureWidget = (featureRef: RefObject<HTMLDivElement>) => {
    if (featureRef.current) {
      this.#featureWidget = new FeatureWidget({
        view: this.#mapView,
        container: featureRef.current,
      });
    }
  };

  setFeatureWidgetGraphic = (graphic: __esri.Graphic) => {
    if (this.#featureWidget) {
      this.#featureWidget.graphic = graphic;
    }
  };

  queryFeatures = () => {
    if (this.#featureLayer) {
      return this.#featureLayer
        .queryFeatures({
          where: '1=1',
          outFields: ['*'],
          returnGeometry: true,
          outSpatialReference: this.#mapView?.spatialReference,
        })
        .then((resut) => {
          const features = resut.features;
          return features;
        });
    }
  };

  get featureWidget() {
    return this.#featureWidget;
  }
}

const mapController = new MapController();
export default mapController;
