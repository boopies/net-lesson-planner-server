import React from 'react';
import ReactDOM from 'react-dom';
import LandingButtons from './LandingButtons'
import {BrowserRouter} from "react-router-dom";


describe('NavBar Component', () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(
      <BrowserRouter><LandingButtons /></BrowserRouter>, div);
      ReactDOM.unmountComponentAtNode(div);
    });
  });