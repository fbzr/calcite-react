import { useEffect, useRef, useState } from 'react';

import '@esri/calcite-components/dist/components/calcite-shell-panel';
import '@esri/calcite-components/dist/components/calcite-panel';
import '@esri/calcite-components/dist/components/calcite-action';
import '@esri/calcite-components/dist/components/calcite-loader';
import {
  CalciteShellPanel,
  CalcitePanel,
  CalciteAction,
  CalciteLoader,
} from '@esri/calcite-components-react';
import mapController from '../../controllers/MapController';
import { useSelector, useDispatch } from 'react-redux';
import {
  $selectedObjectId,
  $loading,
  setSelectedObjectId,
} from '../../store/slices/appSlice';

const SidePanel = () => {
  const dispatch = useDispatch();
  const featureWidgetRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const loading = useSelector($loading);
  const selectedObjectId = useSelector($selectedObjectId);

  const [features, setFeatures] = useState<__esri.Graphic[]>();

  useEffect(() => {
    if (!loading && !mapController.featureWidget) {
      mapController.initializeFeatureWidget(featureWidgetRef);
      mapController.queryFeatures()?.then((results) => {
        setFeatures(results);

        if (results.length) {
          dispatch(setSelectedObjectId(results[0].attributes.OBJECTID));
        }
      });
    }
  }, [loading, features]);

  useEffect(() => {
    if (selectedObjectId && features) {
      const index = features?.findIndex(
        (f) => f.attributes.OBJECTID === selectedObjectId
      );

      if (index !== -1 && features) {
        setCurrentIndex(index);
      }
    }
  }, [selectedObjectId, features]);

  useEffect(() => {
    if (features) {
      mapController.setFeatureWidgetGraphic(features[currentIndex]);
    }
  }, [currentIndex, features]);

  const updateFeature = (navigationType: 'previous' | 'next') => {
    if (navigationType === 'previous' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (
      navigationType === 'next' &&
      currentIndex < features!.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <CalciteShellPanel slot="primary-panel" position="start">
      {/* <Feature handleOpenInfoModal={props.handleOpenInfoModal} /> */}
      <CalcitePanel className="feature-panel">
        {!features || !features.length ? (
          <CalciteLoader label="Loading..." active />
        ) : (
          <div className="heading" slot="header-content">
            <h2>Feature: {`${currentIndex + 1} / ${features?.length}`}</h2>
          </div>
        )}
        <CalciteAction
          onClick={() => {
            updateFeature('previous');
          }}
          text="Previous feature"
          label="Previous feature"
          slot="header-actions-start"
          icon="chevron-left"
          appearance="solid"
          scale="m"
        ></CalciteAction>
        <CalciteAction
          onClick={() => {
            updateFeature('next');
          }}
          text="Next feature"
          label="Next feature"
          slot="header-actions-end"
          icon="chevron-right"
          appearance="solid"
          scale="m"
        ></CalciteAction>

        <div className="feature-content-container">
          <div ref={featureWidgetRef} />
        </div>
      </CalcitePanel>
      )
    </CalciteShellPanel>
  );
};

export default SidePanel;
