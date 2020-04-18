import React from 'react'
import * as R from 'ramda'
import Slider from 'rc-slider'
import './App.css'
import 'rc-slider/assets/index.css'

const populationSize = (pow: number) => Math.pow(10, pow)

function buildGetterAndSetter<T,U>(path: string[], obj: U, setObj: (updater: (v: U) => U) => void): [T, (v: T) => void] {
  const lens = R.lensPath(path)
  const value = R.view<any,T>(lens, obj)
  const setValue = (v: T) => setObj(R.set(lens, v)) 
  return [value, setValue]
}

function App() {
  const [populationSizePower, setPopulationSizePower] = React.useState(2)
  const [variations, setVariations] = React.useState({
    e1: {
      a: {conversionRate: 50, numberOfSubjects: 0}, 
      b: {conversionRate: 50, numberOfSubjects: 0},
    },
    e2: {
      a: {conversionRate: 50, numberOfSubjects: 0}, 
      b: {conversionRate: 50, numberOfSubjects: 0}, 
    }
  })

  const [e1aConversionRate, setE1aConversionRate] = buildGetterAndSetter<number, typeof variations>(['e1', 'a', 'conversionRate'], variations, setVariations)
  const [e1bConversionRate, setE1bConversionRate] = buildGetterAndSetter<number, typeof variations>(['e1', 'b', 'conversionRate'], variations, setVariations)
  const [e2aConversionRate, setE2aConversionRate] = buildGetterAndSetter<number, typeof variations>(['e2', 'a', 'conversionRate'], variations, setVariations)
  const [e2bConversionRate, setE2bConversionRate] = buildGetterAndSetter<number, typeof variations>(['e2', 'b', 'conversionRate'], variations, setVariations)

  // const e1aNumberOfSubjects = R.lensPath(['e1', 'a', 'numberOfSubjects'])
  // const e1bNumberOfSubjects = R.lensPath(['e1', 'b', 'numberOfSubjects'])
  // const e2aNumberOfSubjects = R.lensPath(['e2', 'a', 'numberOfSubjects'])
  // const e2bNumberOfSubjects = R.lensPath(['e2', 'b', 'numberOfSubjects'])

  // React.useEffect(() => {

  // })

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
          <label>Variation A Conversion Rate {e1aConversionRate}%</label>
          <Slider min={0} max={100} value={e1aConversionRate} onChange={setE1aConversionRate} />
        </div>

        <div className="SetupForm-Control">
          <label>Variation B Conversion Rate {e1bConversionRate}%</label>
          <Slider min={0} max={100} value={e1bConversionRate} onChange={setE1bConversionRate} />
        </div>

        <h4>Experiment 2</h4>

        <p>This experiment is an A/B test intended to try and get a user to complete Step 2</p>

        <div className="SetupForm-Control">
          <label>Variation A Conversion Rate {e2aConversionRate}%</label>
          <Slider min={0} max={100} value={e2aConversionRate} onChange={setE2aConversionRate} />
        </div>

        <div className="SetupForm-Control">
          <label>Variation B Conversion Rate {e2bConversionRate}%</label>
          <Slider min={0} max={100} value={e2bConversionRate} onChange={setE2bConversionRate} />
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
