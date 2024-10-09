import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import FileReader from './components/FileReader';
import MetroTrain from './components/Train';
import ResponsiveHeader from './components/ResponsiveHeader';
import Home from './components/Home';
import ErrorBoundary from './components/ErrorBoundary';


const App = () => {
  return (
    <div className='App'>
      <ErrorBoundary> 
      <ResponsiveHeader />
      <MetroTrain/>
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/manual" element={<Home/>} />
        <Route path="/" element={<Home/>} /> {/* Default route */}
      </Routes>
      </ErrorBoundary>

    </div>
 
);
};

export default App;
