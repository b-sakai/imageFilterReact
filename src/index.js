import React from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './index.css';
import Blue from './effects/Blue';
import AnimationBlue from './effects/AnimationBlue';
import RotatingRadialGradients from './effects/RotatingRadialGradients';
import CursorSpringEffect from './effects/CursorSpringEffect';
import Saturation from './effects/Saturation';
import RareCard from './effects/RareCard';
import reportWebVitals from './reportWebVitals';

const TabSwitcher = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Blue</Tab>
        <Tab>Animation blue</Tab>
        <Tab>Rotating radial gradients</Tab>
        <Tab>Cursor spring effect</Tab>
        <Tab>Saturation</Tab>
        <Tab>RareCard</Tab>        
      </TabList>

      <TabPanel>
        <Blue />
      </TabPanel>
      <TabPanel>
        <AnimationBlue />
      </TabPanel>
      <TabPanel>
        <RotatingRadialGradients />
      </TabPanel>
      <TabPanel>
        <CursorSpringEffect />
      </TabPanel>
      <TabPanel>
        <Saturation />
      </TabPanel>
      <TabPanel>
        <RareCard />
      </TabPanel>      
    </Tabs>
  );
};

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<TabSwitcher />);

reportWebVitals();
