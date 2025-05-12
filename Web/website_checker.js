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
    "https://store.steampowered.com/",
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
 * Checks if a website is accessible using fetch API with multiple CORS proxies
 * Enhanced with retry mechanism, more proxies, content validation, and caching
 * 
 * @param {string} url - The URL of the website to check
 * @returns {Promise<{isAccessible: boolean, error: string|null}>} - Result object
 */
async function checkWebsiteAccessibility(url) {
    // Check cache first
    if (websiteCache.has(url)) {
        const cachedResult = websiteCache.get(url);
        // Only use cache if it's not too old (5 minutes)
        if (Date.now() - cachedResult.timestamp < 5 * 60 * 1000) {
            return cachedResult.result;
        }
    }

    // List of CORS proxies to try in order (expanded list for more redundancy)
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
    
    // Define common block page indicators
    const blockIndicators = [
        'access denied', 'blocked', 'unavailable', 'not available',
        'restricted', 'this site can\'t be reached', 'cannot be reached',
        'connection reset', 'connection refused', 'network error',
        'proxy error', 'gateway error', 'firewall', 'forbidden',
        'this page isn\'t working', 'ERR_CONNECTION_REFUSED',
        'ERR_CONNECTION_RESET', 'ERR_NETWORK_ACCESS_DENIED',
        'site can\'t be reached', 'page cannot be displayed',
        'connection timed out', 'unable to connect', 'site blocked',
        'content filtering', 'network administrator', 'security policy',
        'this website has been blocked', 'access to this site has been blocked',
        'your organization\'s policies are preventing', 'your connection is not private',
        'your connection is not secure', 'certificate error', 'ssl error',
        'this connection is untrusted', 'security certificate', 'privacy error'
    ];
    
    // Steam-specific block indicators
    if (url.includes('steam')) {
        blockIndicators.push(
            'store.steampowered', 'steamcommunity', 'steampowered.com',
            'steam store', 'steam community', 'valve corporation'
        );
    }
    
    // Try direct access first (will likely fail due to CORS but worth trying)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for direct access
        
        // Try with cors mode first
        try {
            const corsResponse = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                signal: controller.signal,
                cache: 'no-store'
            });
            
            // If we get here without a CORS error, check the status
            if (corsResponse.ok) {
                // Even if we get a 200 OK, we need to verify the content isn't a block page
                try {
                    const text = await corsResponse.text();
                    const lowerText = text.toLowerCase();
                    
                    // Check for block page indicators
                    const foundBlockIndicator = blockIndicators.find(indicator => 
                        lowerText.includes(indicator.toLowerCase())
                    );
                    
                    if (foundBlockIndicator) {
                        clearTimeout(timeoutId);
                        const result = { 
                            isAccessible: false, 
                            error: `Block page detected: ${foundBlockIndicator}`,
                            proxyUsed: 'direct',
                            statusCode: corsResponse.status
                        };
                        websiteCache.set(url, { result, timestamp: Date.now() });
                        return result;
                    }
                    
                    // For Steam specifically, check if we're getting a real page or a block page
                    if (url.includes('steam') || url.includes('steampowered')) {
                        // If it doesn't contain expected Steam content, it's likely blocked
                        if (!lowerText.includes('valve') && !lowerText.includes('steam store')) {
                            clearTimeout(timeoutId);
                            const result = { 
                                isAccessible: false, 
                                error: 'Steam appears to be blocked (content verification failed)',
                                proxyUsed: 'direct',
                                statusCode: corsResponse.status
                            };
                            websiteCache.set(url, { result, timestamp: Date.now() });
                            return result;
                        }
                    }
                    
                    // If we get here, the site is likely accessible
                    clearTimeout(timeoutId);
                    const result = { 
                        isAccessible: true, 
                        error: null,
                        proxyUsed: 'direct',
                        statusCode: corsResponse.status,
                        contentVerified: true
                    };
                    websiteCache.set(url, { result, timestamp: Date.now() });
                    return result;
                } catch (textError) {
                    // If we can't get the text, we can't verify if it's a block page
                    // Continue with proxies for verification
                }
            }
        } catch (corsError) {
            // Expected CORS error, continue with no-cors mode
        }
        
        // Fall back to no-cors mode, but we can't rely on this alone
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal,
            cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        
        // With no-cors mode, we can't actually tell if the site is accessible from the response
        // But for common sites like Google, Wikipedia, etc., we can assume they're accessible
        // if we get a response without an error
        
        // Check if this is a common site that's likely accessible
        const commonSites = [
            'google.com', 'wikipedia.org', 'office.com', 'microsoft.com',
            'github.com', 'stackoverflow.com', 'mozilla.org', 'apple.com',
            'amazon.com', 'youtube.com', 'linkedin.com', 'indeed.com',
            'coursera.org', 'udemy.com', 'khanacademy.org'
        ];
        
        const hostname = new URL(url).hostname;
        const isCommonSite = commonSites.some(site => hostname.includes(site));
        
        if (isCommonSite) {
            // For common sites, assume they're accessible if we get a response
            const result = { 
                isAccessible: true, 
                error: null,
                proxyUsed: 'direct (common site)',
                statusCode: 'unknown (no-cors)',
                contentVerified: false,
                note: 'Common site assumed accessible'
            };
            websiteCache.set(url, { result, timestamp: Date.now() });
            return result;
        } else {
            // For other sites, we still need verification
            const result = { 
                isAccessible: false, 
                error: 'Direct access inconclusive - needs proxy verification',
                proxyUsed: 'direct attempt',
                needsVerification: true
            };
            
            // Don't cache this result as it's inconclusive
            return result;
        }
    } catch (directError) {
        // Direct access failed, continue with proxies
    }
    
    // Try each proxy with retry mechanism
    for (const proxy of corsProxies) {
        // Try up to 3 times with exponential backoff
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                // Set a timeout for the fetch request
                const controller = new AbortController();
                // Increase timeout for each retry attempt
                const timeout = 5000 + (attempt * 2000); // 5s, 7s, 9s
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                
                // Use GET to get actual content for verification
                const response = await fetch(proxy.url, {
                    method: 'GET', 
                    mode: 'cors',
                    signal: controller.signal,
                    cache: 'no-store',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 Website Block Checker'
                    }
                });
                
                clearTimeout(timeoutId);
                
                // Check if the response is actually valid
                if (!response.ok) {
                    // If we get a non-200 status code, the site is likely blocked
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                // Try to get the response text to check for block pages
                const text = await response.text();
                const lowerText = text.toLowerCase();
                
                // Check for common block page indicators
                const foundBlockIndicator = blockIndicators.find(indicator => 
                    lowerText.includes(indicator.toLowerCase())
                );
                
                if (foundBlockIndicator) {
                    throw new Error(`Block page detected: ${foundBlockIndicator}`);
                }
                
                // For Steam specifically, check if we're getting a real page or a block page
                if (url.includes('steam') || url.includes('steampowered')) {
                    // If it doesn't contain expected Steam content, it's likely blocked
                    // Steam pages should contain specific content markers
                    const steamMarkers = ['valve', 'steam store', 'steam community', 'powered by steam', 'steamworks'];
                    const hasAnyMarker = steamMarkers.some(marker => lowerText.includes(marker));
                    
                    if (!hasAnyMarker) {
                        throw new Error('Steam appears to be blocked (content verification failed)');
                    }
                }
                
                // For other gaming platforms
                if (url.includes('epicgames')) {
                    if (!lowerText.includes('epic games') && !lowerText.includes('unreal engine')) {
                        throw new Error('Epic Games appears to be blocked (content verification failed)');
                    }
                }
                
                // Additional verification for other sites
                // Check if the page is suspiciously small (might be a block page)
                if (text.length < 500 && !url.includes('api.') && !url.includes('/api/')) {
                    throw new Error('Suspiciously small response - likely a block page');
                }
                
                // If we get here, the site is likely accessible
                const result = { 
                    isAccessible: true, 
                    error: null,
                    proxyUsed: proxy.name,
                    retryAttempt: attempt > 0 ? attempt : null,
                    statusCode: response.status,
                    contentVerified: true
                };
                
                // Cache the result
                websiteCache.set(url, {
                    result,
                    timestamp: Date.now()
                });
                
                return result;
            } catch (error) {
                // If it's not the last attempt, wait before retrying
                if (attempt < 2) {
                    // Exponential backoff: 1s, 2s
                    const backoffTime = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                    continue; // Try again with this proxy
                }
                
                // If this is the last proxy in the list and last attempt, return the error
                if (proxy === corsProxies[corsProxies.length - 1]) {
                    let result;
                    
                    // Check if it's a CORS error
                    if (error.message && error.message.includes('CORS')) {
                        result = { 
                            isAccessible: false, 
                            error: 'CORS policy blocked access (site may still be accessible)',
                            failedProxies: corsProxies.map(p => p.name).join(', ')
                        };
                    }
                    // Check if it's a timeout error
                    else if (error.name === 'AbortError') {
                        result = { 
                            isAccessible: false, 
                            error: 'Request timed out - site likely blocked',
                            failedProxies: corsProxies.map(p => p.name).join(', ')
                        };
                    }
                    // Check if it's a block page
                    else if (error.message && (error.message.includes('Block page') || error.message.includes('blocked'))) {
                        result = { 
                            isAccessible: false, 
                            error: error.message,
                            failedProxies: corsProxies.map(p => p.name).join(', ')
                        };
                    }
                    // HTTP error status codes
                    else if (error.message && error.message.includes('HTTP error!')) {
                        result = { 
                            isAccessible: false, 
                            error: error.message,
                            failedProxies: corsProxies.map(p => p.name).join(', ')
                        };
                    }
                    // Suspiciously small response
                    else if (error.message && error.message.includes('Suspiciously small')) {
                        result = { 
                            isAccessible: false, 
                            error: error.message,
                            failedProxies: corsProxies.map(p => p.name).join(', ')
                        };
                    }
                    else {
                        result = { 
                            isAccessible: false, 
                            error: 'All CORS proxies failed: ' + (error.message || 'Unknown error'),
                            failedProxies: corsProxies.map(p => p.name).join(', ')
                        };
                    }
                    
                    // Cache the negative result (but with shorter expiry)
                    websiteCache.set(url, {
                        result,
                        timestamp: Date.now()
                    });
                    
                    return result;
                }
                
                // If not the last proxy, break the retry loop and continue to the next proxy
                break;
            }
        }
    }
    
    // Try DNS lookup as a last resort (using a public DNS API)
    try {
        const dnsLookupUrl = `https://dns.google/resolve?name=${encodeURIComponent(new URL(url).hostname)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(dnsLookupUrl, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
                // DNS resolves, but that doesn't mean the site is accessible
                // It just means the domain exists
                const result = { 
                    isAccessible: false, 
                    error: 'DNS resolves but site appears to be blocked',
                    proxyUsed: 'DNS lookup',
                    note: 'Domain exists but content is inaccessible'
                };
                
                // Cache the result
                websiteCache.set(url, {
                    result,
                    timestamp: Date.now()
                });
                
                return result;
            }
        }
    } catch (dnsError) {
        // DNS lookup failed, continue to final error
    }
    
    // This should rarely be reached, but just in case
    const finalResult = { 
        isAccessible: false, 
        error: 'All access methods failed - site is likely blocked',
        failedProxies: corsProxies.map(p => p.name).join(', ')
    };
    
    // Cache the negative result
    websiteCache.set(url, {
        result: finalResult,
        timestamp: Date.now()
    });
    
    return finalResult;
}


/**
 * Updates the UI for a website check result
 * 
 * @param {string} url - The URL that was checked
 * @param {boolean} isAccessible - Whether the site is accessible
 * @param {string|null} error - Error message if not accessible
 * @param {string|null} proxyUsed - Which CORS proxy was used successfully
 * @param {string|null} failedProxies - List of proxies that failed
 * @param {number|null} retryAttempt - Which retry attempt succeeded (if any)
 * @param {string|null} note - Additional information about the result
 * @param {number|null} statusCode - HTTP status code if available
 */
function updateWebsiteStatus(url, isAccessible, error, proxyUsed, failedProxies, retryAttempt, note, statusCode) {
    const websiteItem = document.getElementById(`website-${url.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (!websiteItem) return;
    
    const statusIcon = websiteItem.querySelector('.status-icon');
    
    // Remove pending class
    websiteItem.classList.remove('pending');
    
    if (isAccessible) {
        websiteItem.classList.add('accessible');
        statusIcon.innerHTML = '<i class="fas fa-check"></i>';
        
        // Add proxy info if available
        if (proxyUsed) {
            const proxyInfo = document.createElement('span');
            proxyInfo.className = 'proxy-info';
            let proxyText = `via ${proxyUsed}`;
            
            // Add retry information if available
            if (retryAttempt) {
                proxyText += ` (retry #${retryAttempt})`;
            }
            
            proxyInfo.textContent = proxyText;
            websiteItem.appendChild(proxyInfo);
        }
        
        // Add note if available
        if (note) {
            const noteElement = document.createElement('span');
            noteElement.className = 'proxy-info';
            noteElement.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            noteElement.textContent = note;
            websiteItem.appendChild(noteElement);
        }
    } else {
        websiteItem.classList.add('inaccessible');
        statusIcon.innerHTML = '<i class="fas fa-times"></i>';
        
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
        summaryDiv.innerHTML = '<i class="fas fa-check-circle" style="color: #FFFFFF; margin-right: 10px;"></i> All websites are accessible! <i class="fas fa-thumbs-up" style="margin-left: 5px;"></i>';
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
            updateWebsiteStatus(url, result.isAccessible, result.error, result.proxyUsed, result.failedProxies, result.retryAttempt, result.note, result.statusCode);
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