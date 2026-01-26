import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { carSport, search, build, home, location as locationIcon } from 'ionicons/icons';
// Pages
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import Search from './pages/Search';
import Location from './pages/Location';
import Showcase from './pages/Showcase';
import Maintenance from './pages/Maintenance';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
            <Route path="/home" exact={true}>
            <Home />
          </Route>
          <Route path="/showcase" exact={true}>
            <Showcase />
          </Route>
          <Route path="/search" exact={true}>
            <Search />
          </Route>
            <Route path="/maintenance" exact={true}>
              <Maintenance />
            </Route>
            <Route path="/location" exact={true}>
              <Location />
            </Route>
          <Route path="/car/:id" exact={true}>
            <CarDetail />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom" className="ion-no-border bg-white h-20 shadow-sm border-t border-slate-50 pb-4">
          <IonTabButton tab="home" href="/home" className="bg-white">
              <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="showcase" href="/showcase" className="bg-white">
              <IonIcon icon={carSport} />
            <IonLabel>Cars</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/search" className="bg-white">
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
            <IonTabButton tab="maintenance" href="/maintenance" className="bg-white">
              <IonIcon icon={build} />
              <IonLabel>Service</IonLabel>
            </IonTabButton>
            <IonTabButton tab="location" href="/location" className="bg-white">
              <IonIcon icon={locationIcon} />
              <IonLabel>Visítanos</IonLabel>
            </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;
