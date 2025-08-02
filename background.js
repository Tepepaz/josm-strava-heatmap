const url_prefix = "https://content-a.strava.com/identified/globalheat/";
const url_suffix = "/{zoom}/{x}/{y}.png"

/** @type {string[]} */
const cookie_names = [
    'CloudFront-Key-Pair-Id',
    'CloudFront-Policy',
    'CloudFront-Signature',
    '_strava_idcf'
];

async function getHeatmapUrl(tab_url, store_id)
{
    // Strava url format:  https://www.strava.com/maps/global-heatmap?style=dark&terrain=false&sport=Ride&gColor=blue    
    let strava_url = new URL(tab_url);

    // Attempt to set map type based on sport url parameter.
    // Support all Strava sport types
    let sport = strava_url.searchParams.get('sport') || 'All';
    
    // Map Strava sport values to heatmap types
    let map_type;
    switch (sport.toLowerCase()) {
        case 'all':
        case 'ride':
        case 'run':
        case 'water':
        case 'winter':
            map_type = sport.toLowerCase();
            break;
        case 'walk':
        case 'hike':
        case 'trail run':
        case 'trail running':
            map_type = 'run'; // Walk, hike, and trail activities use the same heatmap as run
            break;
        case 'swim':
        case 'swimming':
            map_type = 'water'; // Swimming uses water heatmap
            break;
        case 'ski':
        case 'skiing':
        case 'snowboard':
        case 'snowboarding':
            map_type = 'winter'; // Winter sports use winter heatmap
            break;
        default:
            map_type = 'all'; // Default to all activities
    }

    // Attempt to set map color based on gColor url parameter. Default to  'hot'.
    let gColor = strava_url.searchParams.get('gColor');
    let map_color;
    switch (gColor) {
        case 'hot':
        case 'blue':
        case 'purple':
        case 'gray':
        case 'bluered':
        case 'mobileblue':
            map_color = gColor;
            break;
        default:
            map_color = 'hot';
    }

    // Use Strava domain for cookie retrieval
    const strava_domain = 'https://www.strava.com';
    
    const cookie_promises = cookie_names.map(async name => {
        // Try multiple domains for cookie retrieval
        let value = await getCookieValue(name, strava_domain, store_id);
        if (value === null) {
            // Try with the actual tab URL
            value = await getCookieValue(name, tab_url, store_id);
        }
        if (value === null) {
            // Try with just the domain part
            const domain = new URL(tab_url).origin;
            value = await getCookieValue(name, domain, store_id);
        }
        if (value === null) {
            // Try with .strava.com domain
            value = await getCookieValue(name, 'https://strava.com', store_id);
        }
        if (value === null) {
            // Try with www.strava.com domain
            value = await getCookieValue(name, 'https://www.strava.com', store_id);
        }
        return value !== null ? [name, value] : null;
    });
    
    const cookie_results = await Promise.all(cookie_promises);
    const cookies = new Map(cookie_results.filter(cookie => cookie !== null));

    let heatmap_url = url_prefix + map_type + '/' + map_color + url_suffix;

    // Convert Map to plain object for transmission
    const cookiesObject = {};
    for (let [key, value] of cookies.entries()) {
        cookiesObject[key] = value;
    }
    
    return {
        error: cookies.size !== cookie_names.length,
        heatmap_url,
        map_color,
        map_type,
        cookies: cookiesObject,
    };
}

async function getCookieValue(name, url, store_id)
{
    let cookie = await chrome.cookies.get({
        url: url,
        name: name,
        storeId: store_id
    });
    
    return (cookie) ? cookie.value : null;
}

// Service worker message listener for Manifest V3
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle the message asynchronously
    getHeatmapUrl(sender.tab.url, sender.tab.cookieStoreId)
        .then(result => {
            sendResponse(result);
        })
        .catch(error => {
            console.error('Error in getHeatmapUrl:', error);
            sendResponse({ error: true, message: 'Failed to get heatmap URL' });
        });
    
    // Return true to indicate we will respond asynchronously
    return true;
});
