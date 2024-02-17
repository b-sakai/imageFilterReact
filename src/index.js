import React from 'react';
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './index.css';
import Blue from './Blue';
import AnimationBlue from './AnimationBlue';
import RotatingRadialGradients from './RotatingRadialGradients';
import reportWebVitals from './reportWebVitals';

const TabSwitcher = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Blue</Tab>
        <Tab>Animation blue</Tab>
        <Tab>Rotating radial gradients</Tab>
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
    </Tabs>
  );
};

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<TabSwitcher />);

reportWebVitals();
