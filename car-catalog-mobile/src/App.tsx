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
import { carSport, search, heart, person, grid } from 'ionicons/icons';

// Pages
import Home from './pages/Home';
import CarDetail from './pages/CarDetail';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Showcase from './pages/Showcase';

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

const App: React.FC = () => (
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
          <Route path="/favorites" exact={true}>
            <Favorites />
          </Route>
          <Route path="/profile" exact={true}>
             <Profile />
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
            <IonIcon icon={carSport} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="showcase" href="/showcase" className="bg-white">
            <IonIcon icon={grid} />
            <IonLabel>Cars</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/search" className="bg-white">
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="favorites" href="/favorites" className="bg-white">
            <IonIcon icon={heart} />
            <IonLabel>Saved</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile" className="bg-white">
            <IonIcon icon={person} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
