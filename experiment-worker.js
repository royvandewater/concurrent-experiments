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

  const runs = []
  var i = 0

  for (var i = 0; i < count; i++) {
    runs.push(doRun(rates))

    if (i % 1000 === 0) postMessage(aggregateRuns(runs))
  }

  postMessage(aggregateRuns(runs))
}