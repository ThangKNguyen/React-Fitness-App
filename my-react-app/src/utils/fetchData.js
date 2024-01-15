

export const exerciseOptions = {
    method: 'GET',
    params: {limit: '10'},
    headers: {
      'X-RapidAPI-Key': '83c39df86dmsh7025ce96ef20f35p112cd3jsn74f0c5f632ba',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  };

export const fetchData = async (url, options) => {
    const response = await fetch(url,options);
    const data = await response.json();

    return data;
}