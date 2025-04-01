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
            statusIcon.textContent = '⏳';
            
            const websiteUrl = document.createElement('span');
            websiteUrl.textContent = url;
            
            websiteItem.appendChild(statusIcon);
            websiteItem.appendChild(websiteUrl);
            
            resultsDiv.appendChild(websiteItem);
        });
    }
}

/**
 * Checks if a website is accessible using fetch API
 * 
 * @param {string} url - The URL of the website to check
 * @returns {Promise<{isAccessible: boolean, error: string|null}>} - Result object
 */
async function checkWebsiteAccessibility(url) {
    try {
        // Use a CORS proxy to avoid CORS issues
        // Note: This is a public CORS proxy and might have rate limits
        const corsProxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
        
        // Set a timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(corsProxyUrl, {
            method: 'HEAD', // Only get headers, not the full response
            mode: 'cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return { isAccessible: true, error: null };
    } catch (error) {
        // Check if it's a CORS error
        if (error.message && error.message.includes('CORS')) {
            return { 
                isAccessible: false, 
                error: 'CORS policy blocked access (site may still be accessible)'
            };
        }
        
        // Check if it's a timeout error
        if (error.name === 'AbortError') {
            return { 
                isAccessible: false, 
                error: 'Request timed out'
            };
        }
        
        return { 
            isAccessible: false, 
            error: error.message || 'Unknown error'
        };
    }
}

/**
 * Updates the UI for a website check result
 * 
 * @param {string} url - The URL that was checked
 * @param {boolean} isAccessible - Whether the site is accessible
 * @param {string|null} error - Error message if not accessible
 */
function updateWebsiteStatus(url, isAccessible, error) {
    const websiteItem = document.getElementById(`website-${url.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (!websiteItem) return;
    
    const statusIcon = websiteItem.querySelector('.status-icon');
    
    // Remove pending class
    websiteItem.classList.remove('pending');
    
    if (isAccessible) {
        websiteItem.classList.add('accessible');
        statusIcon.textContent = '✅';
    } else {
        websiteItem.classList.add('inaccessible');
        statusIcon.textContent = '❌';
        
        // Add error message if available
        if (error) {
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = error;
            websiteItem.appendChild(errorMsg);
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
        summaryDiv.textContent = 'All websites are accessible! 🎉';
        summaryDiv.style.backgroundColor = '#e6ffe6';
    } else {
        summaryDiv.textContent = `Results: ${accessibleCount} accessible, ${inaccessibleCount} inaccessible websites`;
        summaryDiv.style.backgroundColor = '#fff3cd';
    }
}

/**
 * Main function to check all websites
 */
async function checkAllWebsites() {
    // Reset UI
    startBtn.disabled = true;
    progressContainer.style.display = 'block';
    summaryDiv.style.display = 'none';
    initializeResults();
    
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
            updateWebsiteStatus(url, result.isAccessible, result.error);
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