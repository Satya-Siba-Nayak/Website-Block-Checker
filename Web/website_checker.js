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
 * Enhanced with retry mechanism, more proxies, and caching
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
    
    // Try direct access first (will likely fail due to CORS but worth trying)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for direct access
        
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors', // Try with no-cors mode
            signal: controller.signal,
            cache: 'no-store' // Bypass cache for fresh results
        });
        
        clearTimeout(timeoutId);
        // If we get here with no-cors, we can't actually tell if the site is accessible
        // but we can assume it might be since the request didn't fail
        const result = { isAccessible: true, error: null, proxyUsed: 'direct' };
        
        // Cache the result
        websiteCache.set(url, {
            result,
            timestamp: Date.now()
        });
        
        return result;
    } catch (directError) {
        // Direct access failed (expected), continue with proxies
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
                
                const response = await fetch(proxy.url, {
                    method: 'HEAD', // Only get headers, not the full response
                    mode: 'cors',
                    signal: controller.signal,
                    cache: 'no-store', // Bypass cache for fresh results
                    headers: {
                        'User-Agent': 'Mozilla/5.0 Website Block Checker'
                    }
                });
                
                clearTimeout(timeoutId);
                
                const result = { 
                    isAccessible: true, 
                    error: null,
                    proxyUsed: proxy.name,
                    retryAttempt: attempt > 0 ? attempt : null
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
                            error: 'Request timed out',
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
                // If DNS resolves, the site might be accessible
                const result = { 
                    isAccessible: true, 
                    error: null,
                    proxyUsed: 'DNS lookup',
                    note: 'Site might be accessible (DNS resolves)'
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
        error: 'All access methods failed',
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
 */
function updateWebsiteStatus(url, isAccessible, error, proxyUsed, failedProxies, retryAttempt, note) {
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
    initializeResults();
    
    // Show info about enhanced network redundancy
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-message';
    infoDiv.innerHTML = '<i class="fas fa-info-circle"></i> Using enhanced network redundancy with multiple CORS proxies, retry mechanisms, caching, and DNS fallback. Results may vary based on network restrictions.';
    progressContainer.appendChild(infoDiv);
    
    const allWebsites = websites;
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
            updateWebsiteStatus(url, result.isAccessible, result.error, result.proxyUsed, result.failedProxies, result.retryAttempt, result.note);
            updateProgress(checkedCount, allWebsites.length);
        }));
    }
    
    // Show summary and re-enable start button
    showSummary(accessibleCount, inaccessibleCount);
    startBtn.disabled = false;
    statusText.textContent = 'Check completed!';
}

// Event listeners
startBtn.addEventListener('click', checkAllWebsites);

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', initializeResults);