import requests
import requests
from tqdm import tqdm

def check_website_accessibility(url):
    """
    Checks if a website is accessible.

    Args:
        url: The URL of the website to check.

    Returns:
        A tuple containing:
            - True if the website is accessible, False otherwise.
            - The status code of the HTTP response (if accessible) or an error message.
    """

    try:
        response = requests.get(url, timeout=5)  # Set a timeout to avoid waiting too long
        return True, response.status_code
    except requests.exceptions.RequestException as e:
        return False, str(e)

websites = [
    # Essentials
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

    # Educational Platforms
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

    # Development Resources
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

    # Gaming & Entertainment
    "https://www.steam.com",
    "https://www.epicgames.com",
    "https://www.twitch.tv",
    "https://www.discord.com",
    "https://www.netflix.com",
    "https://www.primevideo.com",
    "https://www.spotify.com",
    "https://www.youtube.com",
    "https://www.reddit.com",

    # Communication & Collaboration
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

    # Cloud Storage & File Sharing
    "https://www.wetransfer.com",
    "https://pastebin.com",
    "https://internxt.com",
    "https://www.mediafire.com",
    "https://www.box.com",
    "https://mega.nz",

    # Job Search & Career
    "https://www.linkedin.com",
    "https://www.indeed.com",
    "https://www.glassdoor.com",
    "https://www.internships.com",
    "https://www.handshake.com"

    #shopping and finance
    "https://www.ebay.com",
    "https://www.etsy.com",
    "https://www.olx.com",
    

]

inaccessible_sites = []

# Create a progress bar that stays on one line
with tqdm(total=len(websites), desc="Progress", ncols=75, leave=False) as pbar:
    for url in websites:
        pbar.update(1)
        # Move to next line after progress bar and then show the current website
        print(f"\nChecking: {url:<50}", end='', flush=True)
        is_accessible, status_or_error = check_website_accessibility(url)
        
        if not is_accessible:
            inaccessible_sites.append((url, status_or_error))
        pbar.update(1)

# Clear the lines before showing results
print("\r" + " " * 75)
print("\r" + " " * 75)

print("\nBlocked or Inaccessible Websites:")
if inaccessible_sites:
    for url, _ in inaccessible_sites:
        print(f"❌ {url}")
else:
    print("All websites are accessible! 🎉")
input("\nPress Enter to exit...")