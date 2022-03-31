import { useEffect, useRef } from 'react';
import mapController from '../../controllers/MapController';
import './MapView.scss';

const MapView = () => {
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapController.initialize(viewRef);
  }, []);

  return <div ref={viewRef} id="viewDiv"></div>;
};

export default MapView;
