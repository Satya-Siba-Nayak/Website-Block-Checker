# Website Block Checker

A tool to check which websites are blocked on your network by ISP, university, or organization WiFi. Available in both Python CLI and JavaScript browser-based versions.

## Features

- Checks accessibility of commonly used websites across various categories
- Identifies which websites are blocked or inaccessible
- Available in both Python CLI and JavaScript browser-based versions
- CSV upload functionality in the JavaScript version for custom website lists
- Enhanced network redundancy with multiple CORS proxies in the JavaScript version
- Retry mechanisms and caching for improved reliability

## Python Version

### Requirements

- Python 3.6 or higher
- Required packages: `requests`, `tqdm`

### Installation

```bash
pip install requests tqdm
```

### Usage

Run the Python script:

```bash
python website_checker.py
```

The script will check each website and display a progress bar. Once completed, it will show a list of any blocked or inaccessible websites.

## JavaScript Version (Browser-based)

The JavaScript version allows you to check website accessibility directly from your browser without installing Python.

### Usage

1. Open the `index.html` file in your web browser
2. Click the "Start Checking" button
3. The tool will check each website and display the results with visual indicators

### Advanced Features

#### CSV Upload

The JavaScript version supports uploading a custom list of websites via CSV file:

1. Prepare a CSV file with one website URL per line
2. Click the "Choose File" button in the upload section
3. Select your CSV file
4. Click "Start Checking" to test your custom list

You can also download a sample CSV template to get started.

#### Network Redundancy

The JavaScript version implements several techniques to improve reliability:

- Multiple CORS proxies with automatic failover
- Retry mechanisms with exponential backoff
- Result caching to improve performance
- DNS fallback for additional verification

### Notes on Browser Version

- Due to browser security restrictions (CORS), some websites may show as inaccessible even if they're not actually blocked
- The browser version uses CORS proxies to attempt to check websites, but this has limitations
- For the most accurate results, use the Python version

## Website Categories

The tool checks websites across various categories:

- Essentials (Google, Wikipedia, etc.)
- Educational Platforms (Coursera, Udemy, etc.)
- Development Resources (GitHub, Stack Overflow, etc.)
- Gaming & Entertainment (Steam, Netflix, etc.)
- Communication & Collaboration (Slack, Teams, etc.)
- Cloud Storage & File Sharing (Wetransfer, Mega, etc.)
- Job Search & Career (LinkedIn, Indeed, etc.)
- Shopping and Finance (eBay, Etsy, etc.)

## Contributing

Contributions are welcome! Here are some ways you can contribute:

- Add more websites to the default lists
- Improve the detection accuracy
- Add support for more features
- Fix bugs and improve performance
(Git testing.....)
## License

MIT License - See LICENSE file for details.
