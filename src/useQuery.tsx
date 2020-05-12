import React from 'react'

const useQuery = () => {
  const query = new URLSearchParams(window.location.search)

  const [populationSizePower, setPopulationSizePower] = React.useState(parseInt(query.get('psp') || '2'))
  const [e1a, setE1a] = React.useState(parseInt(query.get('e1a') || '50'))
  const [e1b, setE1b] = React.useState(parseInt(query.get('e1b') || '50'))
  const [e2a, setE2a] = React.useState(parseInt(query.get('e2a') || '50'))
  const [e2b, setE2b] = React.useState(parseInt(query.get('e2b') || '50'))

  React.useEffect(() => {
    const url = new URL(window.location.href)
    url.search = new URLSearchParams({
      populationPower: `${populationSizePower}`,
      e1a: `${e1a}`,
      e1b: `${e1b}`,
      e2a: `${e2a}`,
      e2b: `${e2b}`,
    }).toString()

    window.history.pushState({}, 'Concurrent Experiments', url.toString())
  }, [populationSizePower, e1a, e1b, e2a, e2b])

  return {
    populationSizePower, setPopulationSizePower,
    e1a, setE1a,
    e1b, setE1b,
    e2a, setE2a,
    e2b, setE2b,
  }
}

export default useQuery