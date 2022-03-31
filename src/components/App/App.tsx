import { useSelector } from 'react-redux';
import '@esri/calcite-components/dist/components/calcite-scrim';
import '@esri/calcite-components/dist/components/calcite-shell';
import '@esri/calcite-components/dist/components/calcite-shell-panel';
import {
  CalciteScrim,
  CalciteShell,
  CalciteShellPanel,
} from '@esri/calcite-components-react';
import { $loading, $title } from '../../store/slices/appSlice';
import MapView from '../MapView/MapView';
import './App.scss';
import SidePanel from '../SidePanel/SidePanel';

function App() {
  const loading = useSelector($loading);
  const title = useSelector($title);

  return (
    <div className="App">
      {loading ? <CalciteScrim key="scrim" loading /> : null}

      <CalciteShell>
        <header slot="header">
          <h1>{`Calcite Brownbag - ${title}`}</h1>
        </header>

        <SidePanel />

        <MapView />
      </CalciteShell>
    </div>
  );
}

export default App;
