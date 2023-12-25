const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3030;


app.use(cors());

async function generatePdf(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Open URL in the current page
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // Download the PDF
    const pdfBuffer = await page.pdf({
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    // Close the browser instance
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate PDF');
  }
}

app.get('/download-pdf', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const pdfBuffer = await generatePdf(url);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=result.pdf`);

    // Send PDF as response
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
