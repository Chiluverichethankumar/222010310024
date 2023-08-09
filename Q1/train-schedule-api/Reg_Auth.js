const axios = require('axios');

const registeredCompanies = {}; // Store registered companies

app.post('/train/register', async (req, res) => {
  try {
    // Register the company with the John Doe Railway Server
    const registrationResponse = await axios.post(
      'http://20.244.56.144/train/register',
      req.body
    );

    // Save registration details
    const { companyName, clientID, clientSecret } = registrationResponse.data;
    registeredCompanies[companyName] = { clientID, clientSecret };

    return res.status(200).json({ companyName, clientID });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/train/auth', async (req, res) => {
  try {
    const { companyName, clientID, clientSecret } = req.body;

    if (!registeredCompanies[companyName] ||
        registeredCompanies[companyName].clientID !== clientID ||
        registeredCompanies[companyName].clientSecret !== clientSecret) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Issue an authorization token and return it
    const authToken = generateAuthToken(); // Implement this function
    return res.status(200).json({ authToken });
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(500).json({ error: 'Authentication failed' });
  }
})