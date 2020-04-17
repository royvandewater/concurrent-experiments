import React from 'react'
import * as R from 'ramda'
import Slider from 'rc-slider'
import './App.css'
import 'rc-slider/assets/index.css'

const populationSize = (pow: number) => Math.pow(10, pow)

function App() {
  const [populationSizePower, setPopulationSizePower] = React.useState(2)
  const [variations, setVariations] = React.useState({
    e1: {
      a: {conversionRate: 50}, 
      b: {conversionRate: 50}, 
    },
    e2: {
      a: {conversionRate: 50}, 
      b: {conversionRate: 50}, 
    }
  })

  const e1aConversionRate = R.lensPath(['e1', 'a', 'conversionRate'])
  const e1bConversionRate = R.lensPath(['e1', 'b', 'conversionRate'])
  const e2aConversionRate = R.lensPath(['e2', 'a', 'conversionRate'])
  const e2bConversionRate = R.lensPath(['e2', 'b', 'conversionRate'])

  return (
    <div className="App">
      <header>
        <h1>Concurrent Experiments</h1>
      </header>

      <section className="SetupForm">
        <h2>Setup</h2>

        <div className="SetupForm-Control">
          <label>Population Size: {populationSize(populationSizePower)}</label>
          <Slider min={0} max={9} value={populationSizePower} onChange={setPopulationSizePower} />
        </div>

        <h4>Experiment 1</h4>

        <p>This experiment is an A/B test intended to try and get a user to complete Step 1</p>

        <div className="SetupForm-Control">
          <label>Variation A Conversion Rate {R.view(e1aConversionRate, variations)}%</label>
          <Slider min={0} max={100} value={R.view(e1aConversionRate, variations)} onChange={v => setVariations(R.set(e1aConversionRate, v))} />
        </div>

        <div className="SetupForm-Control">
          <label>Variation B Conversion Rate {R.view(e1bConversionRate, variations)}%</label>
          <Slider min={0} max={100} value={R.view(e1bConversionRate, variations)} onChange={v => setVariations(R.set(e1bConversionRate, v))} />
        </div>

        <h4>Experiment 2</h4>

        <p>This experiment is an A/B test intended to try and get a user to complete Step 2</p>

        <div className="SetupForm-Control">
          <label>Variation A Conversion Rate {R.view(e2aConversionRate, variations)}%</label>
          <Slider min={0} max={100} value={R.view(e2aConversionRate, variations)} onChange={v => setVariations(R.set(e2aConversionRate, v))} />
        </div>

        <div className="SetupForm-Control">
          <label>Variation B Conversion Rate {R.view(e2bConversionRate, variations)}%</label>
          <Slider min={0} max={100} value={R.view(e2bConversionRate, variations)} onChange={v => setVariations(R.set(e2bConversionRate, v))} />
        </div>
      </section>

      <section className="Results">
        <h2>Results</h2>
        <table>
          <thead>
            <tr>
              <th>Variation Combo</th>
              <th># of Test Subjects</th>
              <th>Completed Step 1</th>
              <th>% Converted</th>
              <th>Completed Step 2</th>
              <th>% Converted*</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>AA</th>
              <td>0</td>
              <td>0</td>
              <td>0%</td>
              <td>0</td>
              <td>0%</td>
            </tr>
            <tr>
              <th>AB</th>
              <td>0</td>
              <td>0</td>
              <td>0%</td>
              <td>0</td>
              <td>0%</td>
            </tr>
            <tr>
              <th>BA</th>
              <td>0</td>
              <td>0</td>
              <td>0%</td>
              <td>0</td>
              <td>0%</td>
            </tr>
            <tr>
              <th>BB</th>
              <td>0</td>
              <td>0</td>
              <td>0%</td>
              <td>0</td>
              <td>0%</td>
            </tr>
          </tbody>
        </table>

        <dl className="Footnotes">
          <dt>*</dt>
          <dd>This is measured as the percentage of users that completed Step 1 that also completed Step 2 because Step 1 is a prerequisite to get to Step 2.</dd>
        </dl>
      </section>
    </div>
  )
}

export default App
