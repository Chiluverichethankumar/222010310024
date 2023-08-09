const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const validURLs = urls.filter(url => isValidURL(url));

  try {
    const fetchPromises = validURLs.map(url => fetchNumbers(url));
    const responses = await Promise.all(fetchPromises);

    const mergedNumbers = responses
      .flatMap(response => response.data.numbers)
      .filter(Number.isInteger)  // Remove non-integer values
      .filter(number => number >= 0)  // Remove negative values
      .sort((a, b) => a - b)  // Sort in ascending order
      .filter((number, index, self) => self.indexOf(number) === index);  // Remove duplicates

    return res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function fetchNumbers(url) {
  try {
    const response = await axios.get(url, { timeout: 500 });
    return response;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error.message);
    return { data: { numbers: [] } };
  }
}

function isValidURL(url) {
  // You might want to implement more comprehensive URL validation here
  return url.startsWith('http://') || url.startsWith('https://');
}

app.listen(PORT, () => {
  console.log(`Number Management service is running on port ${PORT}`);
});