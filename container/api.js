
const url = 'https://moviesdatabase.p.rapidapi.com/titles/series/%7BseriesId%7D';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'cf93f21eaamsha72545e6982405dp1fe141jsn8337b88a37c2',
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
  }
};

try {
  const response = await fetch(url, options);
  const result = await response.json();
  console.log(result);
} catch (error) {
  console.error(error);
}