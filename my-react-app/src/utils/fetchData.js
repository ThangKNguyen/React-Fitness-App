//83c39df86dmsh7025ce96ef20f35p112cd3jsn74f0c5f632ba

export const exerciseOptions = {
    method: 'GET',
    params: {limit: '10'},
    headers: {
      'X-RapidAPI-Key': '87ed0c4212mshefc15692a7a47c7p19e62fjsnb421159b1227',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    },
  };

export const fetchData = async (url, options) => {
    const response = await fetch(url,options);
    const data = await response.json();

    return data;
}