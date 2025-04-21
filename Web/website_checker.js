// List of websites to check
const websites = [
    // Essentials
    "https://www.google.com",
    "https://scholar.google.com",
    "https://www.wikipedia.org",
    "https://www.office.com",
    "https://www.evernote.com",
    "https://www.onenote.com",
    "https://calendar.google.com",
    "https://www.todoist.com",
    "https://www.duolingo.com",
    "https://www.deepl.com",
    "https://translate.google.com",
    "https://www.citationmachine.net",
    "https://www.zotero.org",
    "https://www.mendeley.com",
    "https://www.proquest.com",

    // Educational Platforms
    "https://www.coursera.org",
    "https://www.udemy.com",
    "https://www.edx.org",
    "https://www.khanacademy.org",
    "https://www.chegg.com",
    "https://www.quizlet.com",
    "https://www.scribd.com",
    "https://www.researchgate.net",
    "https://www.academia.edu",
    "https://www.jstor.org",
    "https://www.overleaf.com",
    "https://www.grammarly.com",
    "https://www.wolframalpha.com",
    "https://www.symbolab.com",

    // Development Resources
    "https://www.github.com",
    "https://www.gitlab.com",
    "https://www.stackoverflow.com",
    "https://www.codecademy.com",
    "https://www.freecodecamp.org",
    "https://www.w3schools.com",
    "https://www.geeksforgeeks.org",
    "https://www.leetcode.com",
    "https://www.hackerrank.com",
    "https://www.codewars.com",
    "https://www.vercel.com",
    "https://www.netlify.com",

    // Gaming & Entertainment
    "https://www.steam.com",
    "https://www.epicgames.com",
    "https://www.twitch.tv",
    "https://www.discord.com",
    "https://www.netflix.com",
    "https://www.primevideo.com",
    "https://www.spotify.com",
    "https://www.youtube.com",
    "https://www.reddit.com",

    // Communication & Collaboration
    "https://www.slack.com",
    "https://www.teams.microsoft.com",
    "https://www.miro.com",
    "https://www.lucidchart.com",
    "https://www.draw.io",
    "https://meet.google.com",
    "https://www.webex.com",
    "https://signal.org",
    "https://www.whatsapp.com",
    "https://www.telegram.org",
    "https://www.messenger.com",

    // Cloud Storage & File Sharing
    "https://www.wetransfer.com",
    "https://pastebin.com",
    "https://internxt.com",
    "https://www.mediafire.com",
    "https://www.box.com",
    "https://mega.nz",

    // Job Search & Career
    "https://www.linkedin.com",
    "https://www.indeed.com",
    "https://www.glassdoor.com",
    "https://www.internships.com",
    "https://www.handshake.com",

    // Shopping and Finance
    "https://www.ebay.com",
    "https://www.etsy.com",
    "https://www.olx.com"
];

// Group websites by category
const websiteCategories = {
    "Essentials": websites.slice(0, 15),
    "Educational Platforms": websites.slice(15, 29),
    "Development Resources": websites.slice(29, 41),
    "Gaming & Entertainment": websites.slice(41, 50),
    "Communication & Collaboration": websites.slice(50, 61),
    "Cloud Storage & File Sharing": websites.slice(61, 67),
    "Job Search & Career": websites.slice(67, 72),
    "Shopping and Finance": websites.slice(72, 75)
};

// DOM elements
const startBtn = document.getElementById('start-btn');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status-text');
const resultsDiv = document.getElementById('results');
const summaryDiv = document.getElementById('summary');
const csvFileInput = document.getElementById('csv-file');
const fileNameDisplay = document.getElementById('file-name');
const downloadSampleLink = document.getElementById('download-sample');

// Add animation class to elements when they appear
function animateElement(element, className = 'animate-in') {
    if (element) {
        element.classList.add(className);
        setTimeout(() => element.classList.remove(className), 500);
    }
}

// Initialize the results container with website categories
function initializeResults() {
    resultsDiv.innerHTML = '';
    
    // Create sections for each category
    for (const [category, sites] of Object.entries(websiteCategories)) {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.textContent = category;
        resultsDiv.appendChild(categoryHeader);
        
        // Create elements for each website in the category
        sites.forEach(url => {
            const websiteItem = document.createElement('div');
            websiteItem.className = 'website-item pending';
            websiteItem.id = `website-${url.replace(/[^a-zA-Z0-9]/g, '-')}`;
            
            const statusIcon = document.createElement('span');
            statusIcon.className = 'status-icon';
            statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const websiteUrl = document.createElement('span');
            websiteUrl.textContent = url;
            
            websiteItem.appendChild(statusIcon);
            websiteItem.appendChild(websiteUrl);
            
            resultsDiv.appendChild(websiteItem);
        });
    }
}

// Cache for storing website accessibility results
const websiteCache = new Map();

/**
 * Checks website accessibility with improved ping, subdomain check, and CORS fallback.
 *
 * @param {string} url The URL to check.
 * @returns {Promise<{isAccessible: boolean, error: string|null, method: string}>}
 */
async function checkWebsiteAccessibility(url) {
    // Check cache first
    if (websiteCache.has(url)) {
        const cachedResult = websiteCache.get(url);
        if (Date.now() - cachedResult.timestamp < 5 * 60 * 1000) return cachedResult.result;
    }

    const hostname = new URL(url).hostname;
    const subdomains = ["www", "m", "mobile", "api", "cdn", "static", "assets"];

    // 1. Initial Ping Check
    try {
        const pingResult = await ping(hostname, 3); // 3-second timeout
        if (pingResult.alive) {
            const result = { isAccessible: true, error: null, method: 'ping' };
            websiteCache.set(url, { result, timestamp: Date.now() });
            return result;
        }
    } catch (pingError) {
        console.error("Ping check failed:", pingError);
    }

    // 2. Subdomain Verification
    for (const sub of subdomains) {
        try {
            const subdomainPingResult = await ping(`${sub}.${hostname}`, 3);
            if (subdomainPingResult.alive) {
                const result = { isAccessible: true, error: 'Main site unreachable, but subdomain OK.', method: `ping (${sub}.${hostname})` };
                websiteCache.set(url, { result, timestamp: Date.now() });
                return result;
            }
        } catch (subPingError) {
            console.debug(`Subdomain ${sub}.${hostname} ping failed:`, subPingError); // Use debug for non-critical errors
        }
    }

    // 3. Fallback to CORS Proxy Checks
    return await checkWithProxies(url);
}

/**
 * Checks website accessibility using CORS proxies.
 *
 * @param {string} url The URL to check.
 * @returns {Promise<{isAccessible: boolean, error: string|null, proxyUsed?: string}>}
 */
async function checkWithProxies(url) {
    // CORS Proxies (expanded list)
    const corsProxies = [
        { url: `https://corsproxy.io/?${encodeURIComponent(url)}`, name: 'corsproxy.io' },
        { url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, name: 'allorigins.win' },
        { url: `https://cors-anywhere.herokuapp.com/${url}`, name: 'cors-anywhere.herokuapp.com' },
        { url: `https://cors.bridged.cc/${url}`, name: 'cors.bridged.cc' },
        { url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, name: 'codetabs.com' },
        { url: `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(url)}`, name: 'htmldriven.com' },
        { url: `https://thingproxy.freeboard.io/fetch/${url}`, name: 'thingproxy.freeboard.io' },
        { url: `https://yacdn.org/proxy/${url}`, name: 'yacdn.org' }
    ];

    // Loop through proxies with retries
    for (const proxy of corsProxies) {
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const controller = new AbortController();
                const timeout = 5000 + attempt * 2000; // Increase timeout on retries
                setTimeout(() => controller.abort(), timeout);

                const response = await fetch(proxy.url, {
                    method: 'HEAD', // Only headers
                    mode: 'cors', // Always use cors mode with proxies
                    signal: controller.signal,
                    cache: 'no-store', // No caching for fresh checks
                    headers: { 'User-Agent': 'Mozilla/5.0 Website Block Checker' }
                });

                clearTimeout(controller.signal.timeoutId);
                const result = {
                    isAccessible: true, error: null, proxyUsed: proxy.name, method: `proxy (${proxy.name})`, retryAttempt: attempt > 0 ? attempt : null
                };
                websiteCache.set(url, { result, timestamp: Date.now() });
                return result;

            } catch (error) {
                if (attempt < 2) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000)); // Exponential backoff
                    continue; // Retry
                }
                if (proxy === corsProxies[corsProxies.length - 1]) {
                    let result;

                    if (error.message && error.message.includes('CORS')) { // Cors Error
                        result = { isAccessible: false, error: 'CORS blocked (site may be accessible)', method: 'proxy', failedProxies: corsProxies.map(p => p.name).join(', ') };
                    } else if (error.name === 'AbortError') { // Timeout error
                        result = { isAccessible: false, error: 'Proxy timeout', method: 'proxy', failedProxies: corsProxies.map(p => p.name).join(', ') };
                    } else {
                        result = { isAccessible: false, error: 'Proxies failed: ' + (error.message || 'Unknown error'), method: 'proxy', failedProxies: corsProxies.map(p => p.name).join(', ') };
                    }
                    return result;
                }
                break; // Move to the next proxy on failure
            }
        }
    }

    // All proxies failed (this should be reached rarely now)
    const finalResult = { isAccessible: false, error: 'All proxies failed', method: 'proxy', failedProxies: corsProxies.map(p => p.name).join(', ') };
    websiteCache.set(url, { result: finalResult, timestamp: Date.now() });
    return finalResult;
}


/**
 * Pings a host to check its reachability.
 *
 * @param {string} host The hostname to ping.
 * @param {number} timeout Timeout in seconds.
 * @returns {Promise<{alive: boolean, time?: number}>}
 */
function ping(host, timeout = 2) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const img = new Image();
        img.onload = () => {
            const endTime = Date.now();
            resolve({ alive: true, time: endTime - startTime });
        };
        img.onerror = () => resolve({ alive: false });
        img.src = `http://${host}/favicon.ico?t=${Date.now()}`; // Favicon often small and cached
        setTimeout(() => {
            resolve({ alive: false });
        }, timeout * 1000);
    });
}

/** @deprecated
 * Checks website accessibility using a DNS lookup.
 *
 * @param {string} url The URL to check.
 * @returns {Promise<{isAccessible: boolean, error: string|null, method: string}>}
 */
async function checkWithDNS(url) {
    try {
        const dnsLookupUrl = `https://dns.google/resolve?name=${encodeURIComponent(new URL(url).hostname)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(dnsLookupUrl, {
            signal: controller.signal
        });
        
        clearTimeout(controller.signal.timeoutId);
        if (response.ok) {
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
                const result = { isAccessible: true, error: null, method: 'DNS lookup' };
                websiteCache.set(url, { result, timestamp: Date.now() });
                return result;
            }
        }
    } catch (dnsError) {
        console.error("DNS lookup failed:", dnsError);
    }

    return { isAccessible: false, error: 'DNS lookup failed', method: 'DNS lookup' };
}

function updateWebsiteStatus(url, isAccessible, error, method, proxyUsed, failedProxies, retryAttempt) {
    const websiteItem = document.getElementById(`website-${url.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (!websiteItem) return;

    const statusIcon = websiteItem.querySelector('.status-icon');
    websiteItem.classList.remove('pending');

    if (isAccessible) {
        websiteItem.classList.add('accessible');
        statusIcon.innerHTML = '<i class="fas fa-check"></i>';

        if (method) {
            const noteElement = document.createElement('span');
            noteElement.className = 'proxy-info';
            noteElement.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            noteElement.textContent = note;
            websiteItem.appendChild(noteElement);
        }
    } else {
        websiteItem.classList.add('inaccessible');
        statusIcon.innerHTML = '<i class="fas fa-times"></i>'; // Red X for blocked/failed
        
        // Add error message if available
        if (error) {
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = error;
            websiteItem.appendChild(errorMsg);
        }
        
        // Add failed proxies info if available
        if (failedProxies) {
            const proxyInfo = document.createElement('span');
            proxyInfo.className = 'failed-proxies';
            proxyInfo.textContent = `Failed proxies: ${failedProxies}`;
            websiteItem.appendChild(proxyInfo);
        }
    }
}

/**
 * Updates the progress bar and status text
 * 
 * @param {number} current - Current progress
 * @param {number} total - Total items to process
 */
function updateProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    progressBar.value = percentage;
    statusText.textContent = `Checking websites: ${current}/${total} (${percentage}%)`;
}

/**
 * Shows a summary of the results
 * 
 * @param {number} accessibleCount - Number of accessible websites
 * @param {number} inaccessibleCount - Number of inaccessible websites
 */
function showSummary(accessibleCount, inaccessibleCount) {
    summaryDiv.style.display = 'block';
    
    if (inaccessibleCount === 0) {
        summaryDiv.innerHTML = '<i class="fas fa-check-circle" style="color: #FFFFFF; margin-right: 10px;"></i> All websites are accessible! <i class="fas fa-thumbs-up" style="margin-left: 5px;"></i>'; // Use success icon
        summaryDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        summaryDiv.style.color = '#FFFFFF';
    } else {
        summaryDiv.innerHTML = `<div><i class="fas fa-info-circle" style="margin-right: 10px;"></i> Results: <span style="color: #FFFFFF; font-weight: bold;">${accessibleCount}</span> accessible, <span style="color: #AAAAAA; font-weight: bold;">${inaccessibleCount}</span> inaccessible websites</div>`;
        summaryDiv.style.backgroundColor = 'rgba(153, 153, 153, 0.1)';
        summaryDiv.style.color = '#FFFFFF';
    }
}

/**
 * Main function to check all websites
 */
async function checkAllWebsites() {
    // Reset UI
    startBtn.disabled = true;
    progressContainer.style.display = 'block';
    animateElement(progressContainer);
    summaryDiv.style.display = 'none';
    
    // Show info about enhanced network redundancy
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-message';
    infoDiv.innerHTML = '<i class="fas fa-info-circle"></i> Using enhanced network redundancy with multiple CORS proxies, retry mechanisms, caching, and DNS fallback. Results may vary based on network restrictions.';
    progressContainer.appendChild(infoDiv);
    
    // Check if custom websites are available from CSV upload
    let allWebsites = websites;
    let isCustomList = false;
    const customWebsites = localStorage.getItem('customWebsites');
    
    if (customWebsites) {
        try {
            const parsedWebsites = JSON.parse(customWebsites);
            if (parsedWebsites && parsedWebsites.length > 0) {
                allWebsites = parsedWebsites;
                isCustomList = true;
                
                // Add info about using custom list
                const customListInfo = document.createElement('div');
                customListInfo.className = 'info-message';
                customListInfo.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                customListInfo.innerHTML = `<i class="fas fa-list-alt"></i> Using your custom list with ${allWebsites.length} websites.`;
                progressContainer.appendChild(customListInfo);
            }
        } catch (e) {
            console.error('Error parsing custom websites:', e);
            // If there's an error, fall back to default websites
            allWebsites = websites;
        }
    }
    
    // Initialize results based on whether we're using custom list or default categories
    if (isCustomList) {
        // For custom list, create a simple list without categories
        resultsDiv.innerHTML = '';
        
        // Create elements for each website in the custom list
        allWebsites.forEach(url => {
            const websiteItem = document.createElement('div');
            websiteItem.className = 'website-item pending';
            websiteItem.id = `website-${url.replace(/[^a-zA-Z0-9]/g, '-')}`;
            
            const statusIcon = document.createElement('span');
            statusIcon.className = 'status-icon';
            statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            const websiteUrl = document.createElement('span');
            websiteUrl.textContent = url;
            
            websiteItem.appendChild(statusIcon);
            websiteItem.appendChild(websiteUrl);
            
            resultsDiv.appendChild(websiteItem);
        });
    } else {
        // For default list, use the categorized initialization
        initializeResults();
    }
    
    let checkedCount = 0;
    let accessibleCount = 0;
    let inaccessibleCount = 0;
    
    // Update initial progress
    updateProgress(checkedCount, allWebsites.length);
    
    // Process websites in batches to avoid overwhelming the browser
    const batchSize = 5;
    for (let i = 0; i < allWebsites.length; i += batchSize) {
        const batch = allWebsites.slice(i, i + batchSize);
        
        // Process each batch concurrently
        await Promise.all(batch.map(async (url) => {
            const result = await checkWebsiteAccessibility(url);
            
            // Update counts
            checkedCount++;
            if (result.isAccessible) {
                accessibleCount++;
            } else {
                inaccessibleCount++;
            }
            
            // Update UI
            updateWebsiteStatus(url, result.isAccessible, result.error, result.method, result.proxyUsed, result.failedProxies, result.retryAttempt);
            updateProgress(checkedCount, allWebsites.length);
        }));
    }
    
    // Show summary and re-enable start button
    showSummary(accessibleCount, inaccessibleCount);
    startBtn.disabled = false;
    statusText.textContent = 'Check completed!';
}

/**
 * Parse CSV content and extract valid URLs
 * 
 * @param {string} csvContent - The content of the CSV file
 * @returns {string[]} - Array of valid URLs
 */
function parseCSVContent(csvContent) {
    // Split by newline and filter out empty lines
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
    
    // Validate each URL
    const validUrls = [];
    const invalidUrls = [];
    
    lines.forEach(line => {
        // Remove quotes if present and trim whitespace
        const url = line.replace(/["']/g, '').trim();
        
        try {
            // Check if it's a valid URL
            new URL(url);
            validUrls.push(url);
        } catch (e) {
            invalidUrls.push(url);
        }
    });
    
    // If there are invalid URLs, show a warning
    if (invalidUrls.length > 0) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'info-message';
        warningDiv.style.backgroundColor = 'rgba(255, 200, 0, 0.1)';
        warningDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${invalidUrls.length} invalid URL(s) were found and skipped.`;
        progressContainer.appendChild(warningDiv);
    }
    
    return validUrls;
}

/**
 * Handle CSV file upload
 * 
 * @param {Event} event - The file input change event
 */
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Update file name display
    fileNameDisplay.textContent = file.name;
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'info-message';
        errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please upload a CSV file.`;
        
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.info-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Add the error message
        document.querySelector('.upload-container').appendChild(errorDiv);
        return;
    }
    
    // Read file content
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const customUrls = parseCSVContent(content);
        
        if (customUrls.length > 0) {
            // Store the custom URLs
            localStorage.setItem('customWebsites', JSON.stringify(customUrls));
            
            // Show success message with details
            const successDiv = document.createElement('div');
            successDiv.className = 'info-message';
            successDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
            successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${customUrls.length} website(s) loaded successfully. Click "Start Checking" to begin.`;
            
            // Remove any existing messages
            const existingMessages = document.querySelectorAll('.info-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Add the success message
            document.querySelector('.upload-container').appendChild(successDiv);
            
            // Show a preview of the first few URLs
            if (customUrls.length > 0) {
                const previewDiv = document.createElement('div');
                previewDiv.className = 'csv-format-info';
                previewDiv.style.marginTop = '10px';
                
                const previewHeader = document.createElement('p');
                previewHeader.innerHTML = `<strong>Preview of uploaded websites:</strong>`;
                previewDiv.appendChild(previewHeader);
                
                const previewList = document.createElement('pre');
                // Show up to 5 URLs in the preview
                const previewUrls = customUrls.slice(0, 5).join('\n');
                previewList.textContent = previewUrls;
                
                if (customUrls.length > 5) {
                    previewList.textContent += `\n... and ${customUrls.length - 5} more`;
                }
                
                previewDiv.appendChild(previewList);
                
                // Add a button to clear the custom list and revert to default
                const clearButton = document.createElement('button');
                clearButton.textContent = 'Clear Custom List';
                clearButton.style.backgroundColor = '#333333';
                clearButton.style.color = '#FFFFFF';
                clearButton.style.border = '1px solid #444444';
                clearButton.style.borderRadius = '4px';
                clearButton.style.padding = '0.5rem 1rem';
                clearButton.style.marginTop = '10px';
                clearButton.style.cursor = 'pointer';
                clearButton.style.fontSize = '0.9rem';
                
                clearButton.addEventListener('click', function() {
                    localStorage.removeItem('customWebsites');
                    previewDiv.remove();
                    successDiv.innerHTML = `<i class="fas fa-info-circle"></i> Custom list cleared. Default websites will be used.`;
                    successDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                });
                
                previewDiv.appendChild(clearButton);
                document.querySelector('.upload-container').appendChild(previewDiv);
            }
            
            // Enable start button if it was disabled
            startBtn.disabled = false;
        } else {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'info-message';
            errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            errorDiv.innerHTML = `<i class="fas fa-times-circle"></i> No valid URLs found in the file. Please check the format and try again.`;
            
            // Remove any existing messages
            const existingMessages = document.querySelectorAll('.info-message');
            existingMessages.forEach(msg => msg.remove());
            
            // Add the error message
            document.querySelector('.upload-container').appendChild(errorDiv);
        }
    };
    
    reader.readAsText(file);
}

/**
 * Create and download a sample CSV file with a variety of websites
 */
function downloadSampleCSV() {
    // Create a more comprehensive sample with different types of websites
    const sampleContent = `https://www.google.com
https://www.github.com
https://www.wikipedia.org
https://www.youtube.com
https://www.reddit.com
https://www.microsoft.com
https://www.apple.com
https://www.amazon.com
https://www.netflix.com
https://www.twitter.com
https://www.linkedin.com
https://www.instagram.com
https://www.facebook.com
https://www.spotify.com
https://www.dropbox.com`;
    
    const blob = new Blob([sampleContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_websites.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show a confirmation message
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'info-message';
    confirmDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
    confirmDiv.innerHTML = `<i class="fas fa-check-circle"></i> Sample CSV downloaded. You can use this as a template for your own list.`;
    
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.csv-format-info .info-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Add the confirmation message
    document.querySelector('.csv-format-info').appendChild(confirmDiv);
}

// Event listeners
startBtn.addEventListener('click', checkAllWebsites);
csvFileInput.addEventListener('change', handleFileUpload);
downloadSampleLink.addEventListener('click', downloadSampleCSV);

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Clear any stored custom websites when the page loads
    localStorage.removeItem('customWebsites');
    initializeResults();
});

// Update file name display when a file is selected
csvFileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        fileNameDisplay.textContent = this.files[0].name;
    } else {
        fileNameDisplay.textContent = 'No file selected';
    }
});
