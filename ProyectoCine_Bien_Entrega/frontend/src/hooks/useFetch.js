import { useState, useEffect } from "react";


export const useFetch = (fetchFuntion,dependencies=[]) => {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const fetchData = async()=> {
    try{
      const result = await fetchFuntion();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    fetchData();
    return () => {
      abortController.abort();
    };
  }, dependencies);
  
  return { data, loading, error };
};
