import React from 'react'
import * as R from 'ramda'
import Slider from 'rc-slider'
import './App.css'
import 'rc-slider/assets/index.css'

const populationSize = (pow: number) => Math.pow(10, pow)

function buildGetterAndSetter<T,U>(prop: string, obj: U, setObj: (updater: (v: U) => U) => void): [T, (v: T) => void] {
  const lens = R.lensProp(prop)
  const value = R.view<any,T>(lens, obj)
  const setValue = (v: T) => setObj(R.set(lens, v)) 
  return [value, setValue]
}

interface Rates {
  e1a: number;
  e1b: number;
  e2a: number;
  e2b: number;
}

interface Result {
  count: number;
  step1: {
    numberCompleted: number;
    percentageCompleted: number;
  }
  step2: {
    numberCompleted: number;
    percentageCompleted: number;
  }
}

interface Results {
  AA: Result;
  AB: Result;
  BA: Result;
  BB: Result;
}

const calculateProgress = (count: number, results: Results | undefined) => {
  if (results === undefined) return 0

  const total = results.AA.count + results.AB.count + results.BA.count + results.BB.count

  return Math.round(100 * total / count)
}

function App() {
  const [populationSizePower, setPopulationSizePower] = React.useState(2)
  const [rates, setRates] = React.useState<Rates>({
    e1a: 50,
    e1b: 50,
    e2a: 50,
    e2b: 50,
  })

  const [e1aConversionRate, setE1aConversionRate] = buildGetterAndSetter<number, typeof rates>('e1a', rates, setRates)
  const [e1bConversionRate, setE1bConversionRate] = buildGetterAndSetter<number, typeof rates>('e1b', rates, setRates)
  const [e2aConversionRate, setE2aConversionRate] = buildGetterAndSetter<number, typeof rates>('e2a', rates, setRates)
  const [e2bConversionRate, setE2bConversionRate] = buildGetterAndSetter<number, typeof rates>('e2b', rates, setRates)

  const [results, setResults] = React.useState<Results | undefined>(undefined)

  React.useEffect(() => setResults(undefined), [rates, populationSizePower])

  const worker = React.useMemo(() => {
    const w = new Worker(`${process.env.PUBLIC_URL}/experiment-worker.js`)
    w.onmessage = (e) => setResults(e.data)
    return w
  }, [])

  const count = populationSize(populationSizePower)

  const runExperiment = () => {
    worker.postMessage({count, rates})
  }

  const progress = calculateProgress(count, results)

  return (
    <div className="App">
      <header>
        <h1>Concurrent Experiments</h1>
      </header>

      <section className="SetupForm">
        <h2>Setup</h2>

        <div className="SetupForm-Control">
          <label>Population Size: {count}</label>
          <Slider min={0} max={7} value={populationSizePower} onChange={setPopulationSizePower} />
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

        {0 < progress && progress < 100 &&
        <div className="SetupForm-Control">
          <label>Progress</label>
          <Slider min={0} max={100} value={progress} disabled />
        </div>
        }
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
          <dd>This is measured as the percentage of users that completed Step 1 that also completed Step 2.</dd>
        </dl>
      </section>
    </div>
  )
}

export default App
