import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import {
  wheelTypes,
  tireSizes,
  crankOptions,
  cassetteOptions,
} from './settings';

import 'milligram';
import './styles.css';

ReactGA.initialize('UA-141543901-1');

const defaultUnits = 'metric';
const defaultCadence = 80;
const defaultWheelType = wheelTypes[0].value;
const defaultTireSize = tireSizes[9];
const defaultCrank = 3;
const defaultCassette = 3;

const App = ({ data }) => {
  const [ selectedCrank, setSelectedCrank ] = useState(defaultCrank);
  const [ selectedCassette, setSelectedCassette ] = useState(defaultCassette);
  const [ units, setUnits ] = useState(defaultUnits);
  const [ cadence, setCadence ] = useState(defaultCadence);
  const [ wheelType, setWheelType ] = useState(defaultWheelType);
  const [ tireSize, setTireSize ] = useState(defaultTireSize);

  useEffect(() => {

  }, []);

  const cassetteOptionLabel = cassette => {
    const cogs = cassette.split(',');
    const speed = cogs.length;
    const label = `${cogs[0]}-${cogs[speed-1]} ${speed}-speed`;
    return label;
  }

  const displaySpeed = speed => {
    const value = units === 'metric' ? Math.round(speed * 1.609) : speed;
    const label = units === 'metric' ? 'km/h' : 'mph';
    return `${value} ${label}`;
  }

  const renderGearRatios = crank => cassetteOptions[selectedCassette].split(',').map(cog => {
    const key = `${crank}-${cog}`;
    const ratio = (crank/cog).toFixed(2);
    const wheelSize = Math.round((wheelType + (tireSize * 2)) / 25.4);
    const gearInches = Math.round(wheelSize * ratio);
    const speed = Math.round(gearInches * cadence * (Math.PI / 1056));

    return (
      <td key={key} style={{ textAlign: 'center' }}>
        {`${ratio}:1`} <br />
        {displaySpeed(speed)}
      </td>
    );
  });

  const renderTableHeaders = () => {
    return (
      <tr>
        <th></th>
        {cassetteOptions[selectedCassette].split(',').map(item => <th key={item} style={{ textAlign: 'center' }}>{`${item}t`}</th>)} 
      </tr>
    );
  }

  const renderTableRows = () => {
    return crankOptions[selectedCrank].split('/').map(item => (
      <tr key={item}>
        <td key={item}>{`${item}t`}</td>
        {renderGearRatios(item)}
      </tr>
    ));
  }

  return (
    <div className="container">
      <header>
        <div className="row">
          <div className="column"><a href="/">velox.cc</a> / gear-ratios</div>
        </div>
        <div className="row">
          <div className="column">
            <h1 className="main-title">Gear Ratios!</h1>
          </div>
        </div>
      </header>
      <div className="row">
        <div className="column">
          <div className="table">
            <table>
              {/* <caption>{`${crankOptions[selectedCrank].split('/').length}x - ${cassetteOptions[selectedCassette].split(',').length}-speed`}</caption> */}
              <thead>
                {renderTableHeaders()}
              </thead>
              <tbody>
                {renderTableRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label htmlFor="chain-rings">Chain rings</label>
          <select
            id="chain-rings"
            onChange={evt => setSelectedCrank(evt.target.selectedIndex)}
            value={crankOptions[selectedCrank]}
          >
            {crankOptions && crankOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <label htmlFor="wheel-type">Wheel type</label>
          <select
            id="wheel-type"
            onChange={evt => setWheelType(parseInt(evt.target.value, 10))}
          >
            {wheelTypes && wheelTypes.map(option => <option key={option.label} value={option.value}>{option.label}</option>)}
          </select>
        </div>

        <div className="column">
          <label htmlFor="cassette">Cassette</label>

          <select
            id="cassette"
            onChange={evt => setSelectedCassette(evt.target.selectedIndex)}
            value={cassetteOptions[selectedCassette]}
          >
            {cassetteOptions && cassetteOptions.map(option => <option key={option} value={option}>{cassetteOptionLabel(option)}</option>)}
          </select>

          <label htmlFor="tire-size">Tire size</label>
          <select
            id="tire-size"
            onChange={evt => setTireSize(parseInt(evt.target.value, 10))}
            value={tireSize}
          >
            {tireSizes && tireSizes.map(size => <option key={size} value={size}>{`${size}mm`}</option>)}
          </select>
        </div>

      </div>
      
      <div className="row">
        <div className="column column-50">
          <label htmlFor="cadence">Cadence</label>
          <input
            id="cadence"
            type="range"
            min="1"
            max="150"
            onChange={evt => setCadence(evt.target.value)}
            value={cadence}
          /> {`${cadence} rpm`}
        </div>
        
        <div className="column column-50">
          <fieldset>
            <legend>Units</legend>
            <div className="row">
            <div className="column column-25">
              <label className="label-inline">
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  onChange={evt => setUnits(evt.target.value)}
                  checked={units === 'metric'}
                />
                km/h
              </label>
            </div>
            <div className="column column-25">
              <label className="label-inline">
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  onChange={evt => setUnits(evt.target.value)}
                  checked={units === 'imperial'}
                />
                mph
              </label>
            </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
