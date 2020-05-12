const doesConvert = (rate) => {
  const dice = Math.random() * 100
  return dice < rate
}

const doRun = (rates) => {
  const e1Variation = Math.random() > 0.5 ? 'A' : 'B'
  const e2Variation = Math.random() > 0.5 ? 'A' : 'B'

  const e1ConversionRate = e1Variation === 'A' ? rates.e1a : rates.e1b
  const e2ConversionRate = e2Variation === 'A' ? rates.e2a : rates.e2b
      
  const completedStep1 = doesConvert(e1ConversionRate)
  const completedStep2 = completedStep1 && doesConvert(e2ConversionRate)

  return {
    variation: `${e1Variation}${e2Variation}`,
    completedStep1,
    completedStep2,
  }
}

const aggregateRunsForVariation = (runs=[]) => {
  const count = runs.length
  const numberCompletedStep1 = runs.filter(r => r.completedStep1).length
  const numberCompletedStep2 = runs.filter(r => r.completedStep2).length

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

const groupBy = (objectArray, property) => {
  return objectArray.reduce(function (acc, obj) {
    let key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}

const aggregateRuns = (runs) => {
  const grouped = groupBy(runs, 'variation')
  return {
    AA: aggregateRunsForVariation(grouped.AA),
    AB: aggregateRunsForVariation(grouped.AB),
    BA: aggregateRunsForVariation(grouped.BA),
    BB: aggregateRunsForVariation(grouped.BB),
  }
}

onmessage = (e) => {
  const {count, rates} = e.data

  const aggregates = {
    AA: {count: 0, step1: {numberCompleted: 0, percentageCompleted: 0}, step2: {numberCompleted: 0, percentageCompleted: 0} },
    AB: {count: 0, step1: {numberCompleted: 0, percentageCompleted: 0}, step2: {numberCompleted: 0, percentageCompleted: 0} },
    BA: {count: 0, step1: {numberCompleted: 0, percentageCompleted: 0}, step2: {numberCompleted: 0, percentageCompleted: 0} },
    BB: {count: 0, step1: {numberCompleted: 0, percentageCompleted: 0}, step2: {numberCompleted: 0, percentageCompleted: 0} },
  }

  for (var i = 0; i < count; i++) {
    const run = doRun(rates)
    const aggregate = aggregates[run.variation]

    aggregate.count += 1

    if (run.completedStep1) {
      aggregate.step1.numberCompleted += 1
      aggregate.step1.percentageCompleted = Math.round(100 * aggregate.step1.numberCompleted / aggregate.count)
    }

    if (run.completedStep2) {
      aggregate.step2.numberCompleted += 1
      aggregate.step2.percentageCompleted = Math.round(100 * aggregate.step2.numberCompleted / aggregate.count)
    }

    if (i % 1000 === 0) postMessage(aggregates)
  }

  postMessage(aggregates)
}