//83c39df86dmsh7025ce96ef20f35p112cd3jsn74f0c5f632ba

export const exerciseOptions = {
    method: 'GET',
    params: {limit: '10'},
    headers: {
      'X-RapidAPI-Key': 'a1a7a9f659msh9992eb70a3b3d88p1ea93ajsn7e7c3f1e9b78',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    },
  };

export const youtubeOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'a1a7a9f659msh9992eb70a3b3d88p1ea93ajsn7e7c3f1e9b78',
      'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    }
  };

export const fetchData = async (url, options) => {
    const response = await fetch(url,options);
    const data = await response.json();

    return data;
}