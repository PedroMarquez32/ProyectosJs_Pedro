import { useState, useEffect } from "react";

// hook que se encargue de realizar cuaquier petición a una API
export const useFetch = (fetchFuntion,dependencies=[]) => {
  // estado para guardar la data
  const [data, setData] = useState(null);
  // estado para guardar el loading
  const [loading, setLoading] = useState(true);
  // estado para guardar el error
  const [error, setError] = useState(null);
  const fetchData = async()=> {
    try{
      //función que hace la petición a la api
      const result = await fetchFuntion();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    // creo un objeto para abortar la petición
    const abortController = new AbortController();
    setLoading(true);
    fetchData();
    return () => {
      // cuando desmonto el componente aborto la petición
      abortController.abort();
    };
  }, dependencies);
  
  return { data, loading, error };
};
