export const exerciseOptions = {
    method: 'GET',
    params: { limit: '10' },
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_EXERCISE_DB,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    },
};

export const youtubeOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_YOUTUBE_DB,
      'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    }
};

export const fetchData = async (url, options) => {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
};
