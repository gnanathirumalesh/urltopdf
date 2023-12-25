const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
 

const app = express();
const port = 3000;

app.use(cors());

app.get('/download-pdf', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Generate PDF
    const pdfBuffer = await page.pdf();

    // Close browser
    await browser.close();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${url.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

    // Send PDF as response
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


 
  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
