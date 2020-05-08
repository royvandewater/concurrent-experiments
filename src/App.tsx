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

const doesConvert = (rate: number) => {
  const dice = Math.random() * 100
  return dice < rate
}

const aggregateRunsForVariation = (runs: Run[]) => {
  const count = R.length(runs)
  const numberCompletedStep1= R.length(R.filter(R.prop('completedStep1'), runs))
  const numberCompletedStep2= R.length(R.filter(R.prop('completedStep2'), runs))

  return {
    count,
    step1: {
      numberCompleted: numberCompletedStep1,
      percentageCompleted: Math.round(100 * numberCompletedStep1 / count),
    },
    step2: {
      numberCompleted: numberCompletedStep2,
      percentageCompleted: Math.round(100 * numberCompletedStep2 / count),
    }
  }
}

const aggregateRuns = (runs: Run[]) => {
  const grouped = R.groupBy(R.prop('variation'), runs)
  return R.mapObjIndexed(aggregateRunsForVariation, grouped)
}

interface Run {
  variation: string;
  completedStep1: boolean;
  completedStep2: boolean;
}

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

  const [e1aConversionRate, setE1aConversionRate] = buildGetterAndSetter<number, typeof variations>(['e1', 'a', 'conversionRate'], variations, setVariations)
  const [e1bConversionRate, setE1bConversionRate] = buildGetterAndSetter<number, typeof variations>(['e1', 'b', 'conversionRate'], variations, setVariations)
  const [e2aConversionRate, setE2aConversionRate] = buildGetterAndSetter<number, typeof variations>(['e2', 'a', 'conversionRate'], variations, setVariations)
  const [e2bConversionRate, setE2bConversionRate] = buildGetterAndSetter<number, typeof variations>(['e2', 'b', 'conversionRate'], variations, setVariations)

  const [runs, setRuns] = React.useState<Run[]>([])

  const runExperiment = () => {
    setRuns([])

    R.times(() => {
      const e1Variation = Math.random() > 0.5 ? 'A' : 'B'
      const e2Variation = Math.random() > 0.5 ? 'A' : 'B'

      const run = {
        variation: `${e1Variation}${e2Variation}`,
        completedStep1: false,
        completedStep2: false,
      }

      const e1ConversionRate = e1Variation === 'A' ? e1aConversionRate : e1bConversionRate
      const e2ConversionRate = e2Variation === 'A' ? e2aConversionRate : e2bConversionRate
      
      run.completedStep1 = doesConvert(e1ConversionRate)
      run.completedStep2 = run.completedStep1 && doesConvert(e2ConversionRate)

      setRuns(R.append<Run>(run))
    }, populationSize(populationSizePower))
  }

  const results = aggregateRuns(runs)

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

        <div className="SetupForm-ButtonRow">
          <button onClick={runExperiment}>Run</button>
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
              <td>{R.pathOr(0, ['AA', 'count'], results)}</td>
              <td>{R.pathOr(0, ['AA', 'step1', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['AA', 'step1', 'percentageCompleted'], results)}%</td>
              <td>{R.pathOr(0, ['AA', 'step2', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['AA', 'step2', 'percentageCompleted'], results)}%</td>
            </tr>
            <tr>
              <th>AB</th>
              <td>{R.pathOr(0, ['AB', 'count'], results)}</td>
              <td>{R.pathOr(0, ['AB', 'step1', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['AB', 'step1', 'percentageCompleted'], results)}%</td>
              <td>{R.pathOr(0, ['AB', 'step2', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['AB', 'step2', 'percentageCompleted'], results)}%</td>
            </tr>
            <tr>
              <th>BA</th>
              <td>{R.pathOr(0, ['BA', 'count'], results)}</td>
              <td>{R.pathOr(0, ['BA', 'step1', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['BA', 'step1', 'percentageCompleted'], results)}%</td>
              <td>{R.pathOr(0, ['BA', 'step2', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['BA', 'step2', 'percentageCompleted'], results)}%</td>
            </tr>
            <tr>
              <th>BB</th>
              <td>{R.pathOr(0, ['BB', 'count'], results)}</td>
              <td>{R.pathOr(0, ['BB', 'step1', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['BB', 'step1', 'percentageCompleted'], results)}%</td>
              <td>{R.pathOr(0, ['BB', 'step2', 'numberCompleted'], results)}</td>
              <td>{R.pathOr(0, ['BB', 'step2', 'percentageCompleted'], results)}%</td>
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
