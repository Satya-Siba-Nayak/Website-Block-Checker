# Website Block Checker

A tool to check which websites are blocked on your network by ISP, university, or organization WiFi.

## Features

- Checks accessibility of commonly used websites across various categories
- Identifies which websites are blocked or inaccessible
- Available in both Python and JavaScript versions

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

### Notes on Browser Version

- Due to browser security restrictions (CORS), some websites may show as inaccessible even if they're not actually blocked
- The browser version uses a CORS proxy to attempt to check websites, but this has limitations
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

## License

MIT License - See LICENSE file for details.
