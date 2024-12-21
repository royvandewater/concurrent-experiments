import { pathOr } from "ramda";
import { html } from "htm/preact";
import useQuery from "./useQuery.js";
import { CustomSlider } from "./CustomSlider.js";
import { useMemo, useState } from "preact/hooks";

export const App = ({ workerUrl }) => {
  const {
    populationSizePower,
    setPopulationSizePower,
    e1a,
    setE1a,
    e1b,
    setE1b,
    e2a,
    setE2a,
    e2b,
    setE2b,
  } = useQuery();

  /** @type {Rates} */
  const rates = { e1a, e1b, e2a, e2b };

  /** @type {[Results | undefined, (results: Results | undefined) => void]} */
  const [results, setResults] = useState(undefined);

  const worker = useMemo(() => {
    const w = new Worker(workerUrl);
    w.onmessage = (e) => setResults(e.data);
    return w;
  }, []);

  const count = populationSize(populationSizePower);
  const progress = calculateProgress(count, results);

  const runExperiment = () => worker.postMessage({ count, rates });
  const clearResults = () => setResults(undefined);

  return html`
    <div className="App">
      <header>
        <h1>Concurrent Experiments</h1>
      </header>

      <section className="SetupForm">
        <h2>Setup</h2>

        <div className="SetupForm-Control">
          <label>Population Size: ${count}</label>
          <${CustomSlider}
            min=${0}
            max=${7}
            value=${populationSizePower}
            onChange=${setPopulationSizePower}
          />
        </div>

        <h4>Experiment 1</h4>

        <p>
          This experiment is an A/B test intended to try and get a user to
          complete Step 1
        </p>

        <div className="SetupForm-Control">
          <label>Variation A Conversion Rate ${e1a}%</label>
          <${CustomSlider}
            min=${0}
            max=${100}
            value=${e1a}
            onChange=${setE1a}
          />
        </div>

        <div className="SetupForm-Control">
          <label>Variation B Conversion Rate ${e1b}%</label>
          <${CustomSlider}
            min=${0}
            max=${100}
            value=${e1b}
            onChange=${setE1b}
          />
        </div>

        <h4>Experiment 2</h4>

        <p>
          This experiment is an A/B test intended to try and get a user to
          complete Step 2
        </p>

        <div className="SetupForm-Control">
          <label>Variation A Conversion Rate ${e2a}%</label>
          <${CustomSlider}
            min=${0}
            max=${100}
            value=${e2a}
            onChange=${setE2a}
          />
        </div>

        <div className="SetupForm-Control">
          <label>Variation B Conversion Rate ${e2b}%</label>
          <${CustomSlider}
            min=${0}
            max=${100}
            value=${e2b}
            onChange=${setE2b}
          />
        </div>

        <div className="SetupForm-ButtonRow">
          ${progress > 0
            ? html`<button onClick=${clearResults} className="button-danger">
                Clear
              </button>`
            : html`<button onClick=${runExperiment} className="button-primary">
                Run
              </button>`}
        </div>

        ${0 < progress &&
        progress < 100 &&
        html`
          <div className="SetupForm-Control">
            <label>Progress</label>
            <${CustomSlider} min=${0} max=${100} value=${progress} disabled />
          </div>
        `}
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
              <td>${pathOr(0, ["AA", "count"], results)}</td>
              <td>${pathOr(0, ["AA", "step1", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["AA", "step1", "percentageCompleted"], results)}%
              </td>
              <td>${pathOr(0, ["AA", "step2", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["AA", "step2", "percentageCompleted"], results)}%
              </td>
            </tr>
            <tr>
              <th>AB</th>
              <td>${pathOr(0, ["AB", "count"], results)}</td>
              <td>${pathOr(0, ["AB", "step1", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["AB", "step1", "percentageCompleted"], results)}%
              </td>
              <td>${pathOr(0, ["AB", "step2", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["AB", "step2", "percentageCompleted"], results)}%
              </td>
            </tr>
            <tr>
              <th>BA</th>
              <td>${pathOr(0, ["BA", "count"], results)}</td>
              <td>${pathOr(0, ["BA", "step1", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["BA", "step1", "percentageCompleted"], results)}%
              </td>
              <td>${pathOr(0, ["BA", "step2", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["BA", "step2", "percentageCompleted"], results)}%
              </td>
            </tr>
            <tr>
              <th>BB</th>
              <td>${pathOr(0, ["BB", "count"], results)}</td>
              <td>${pathOr(0, ["BB", "step1", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["BB", "step1", "percentageCompleted"], results)}%
              </td>
              <td>${pathOr(0, ["BB", "step2", "numberCompleted"], results)}</td>
              <td>
                ${pathOr(0, ["BB", "step2", "percentageCompleted"], results)}%
              </td>
            </tr>
          </tbody>
        </table>

        <dl className="Footnotes">
          <dt>*</dt>
          <dd>
            This is measured as the percentage of users that completed Step 1
            that also completed Step 2.
          </dd>
        </dl>
      </section>
    </div>
  `;
};

/**
 * @param {number} pow
 * @returns {number}
 */
const populationSize = (pow) => Math.pow(10, pow);

/**
 * @typedef {Object} Rates
 * @property {number} e1a
 * @property {number} e1b
 * @property {number} e2a
 * @property {number} e2b
 */

/**
 * @typedef {Object} Result
 * @property {number} count
 * @property {Object} step1
 * @property {number} step1.numberCompleted
 * @property {number} step1.percentageCompleted
 * @property {Object} step2
 * @property {number} step2.numberCompleted
 * @property {number} step2.percentageCompleted
 */

/**
 * @typedef {Object} Results
 * @property {Result} AA
 * @property {Result} AB
 * @property {Result} BA
 * @property {Result} BB
 */

/**
 * @typedef {Object} Results
 * @property {Result} AA
 * @property {Result} AB
 * @property {Result} BA
 * @property {Result} BB
 */

/**
 *
 * @param {number} count
 * @param {Results | undefined} results
 * @returns
 */
const calculateProgress = (count, results) => {
  if (results === undefined) return 0;

  const total =
    results.AA.count + results.AB.count + results.BA.count + results.BB.count;

  return Math.ceil((100 * total) / count);
};
