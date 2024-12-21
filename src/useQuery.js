import { useEffect, useState } from "preact/hooks";

const useQuery = () => {
  const query = new URLSearchParams(window.location.search);

  const [populationSizePower, setPopulationSizePower] = useState(
    parseInt(query.get("populationPower") || "4")
  );
  const [e1a, setE1a] = useState(parseInt(query.get("e1a") || "50"));
  const [e1b, setE1b] = useState(parseInt(query.get("e1b") || "50"));
  const [e2a, setE2a] = useState(parseInt(query.get("e2a") || "50"));
  const [e2b, setE2b] = useState(parseInt(query.get("e2b") || "50"));

  useEffect(() => {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams({
      populationPower: `${populationSizePower}`,
      e1a: `${e1a}`,
      e1b: `${e1b}`,
      e2a: `${e2a}`,
      e2b: `${e2b}`,
    }).toString();

    window.history.pushState({}, "Concurrent Experiments", url.toString());
  }, [populationSizePower, e1a, e1b, e2a, e2b]);

  return {
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
  };
};

export default useQuery;
