
insertModal();
insertButton();

function insertModal()
{
    document.body.insertAdjacentHTML('afterbegin', `
        <div id="josm-modal" class="josm-modal">
            <div id="josm-modal-dialog" class="josm-modal-dialog">
                <div class="modal-header">
                    <h4 id="josm-modal-message"></h5>
                </div>
                <menu id="imagery-load-menu">
                    <li>
                        <a class="btn btn-xs btn-default" id="josm-click-to-load">Click to open imagery in JOSM</a>
                    </li>
                    <li>Or, manually copy the URL and paste into JOSM imagery preferences:
                        <code>
                            <button id="josm-click-to-copy" class="copy-button btn btn-xs" aria-label="Copy to clipboard" title="Copy to clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                                </svg>
                            </button>
                            <pre id="josm-imagery-url"></pre>
                        </code>
                    </li>
                </menu>
            </div>
        </div>
    `);
    document.querySelector('#josm-modal').addEventListener("click", e => {
        e.target.classList.remove('active')
    })
}

async function insertButton()
{
    let ctrl_top_right = document.querySelector('.mapboxgl-ctrl-top-right');
    // Sometimes the mapbox controls aren't loaded right away and we need to wait a little bit
    for (let i = 0; ctrl_top_right === null && i < 10; i++) {
        await new Promise(r => setTimeout(r, 300));
        ctrl_top_right = document.querySelector('.mapboxgl-ctrl-top-right');
    }
    let button = document.createElement('button');
    button.className = 'josm-imagery';
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">
        <defs>
            <linearGradient id="a">
            <stop offset="0"/>
            <stop offset=".5" stop-color="#f50"/>
            <stop offset="1" stop-opacity=".9"/>
            </linearGradient>
            <linearGradient xlink:href="#a" id="b" x1="43.8" y1="43.4" x2="4.7" y2="5.5" gradientUnits="userSpaceOnUse"/>
        </defs>
        <path d="M46 32.8H32.8V46H46zm-30.8 0H2V46h13.2zm15.4 0H17.4V46h13.2zm0-15.4H17.4v13.2h13.2zm-15.4 0H2v13.2h13.2zm30.8 0H32.8v13.2H46zM15.2 2H2v13.2h13.2zM46 2H32.8v13.2H46zM30.6 2H17.4v13.2h13.2z" fill="url(#b)"/>
        </svg>
    `
    ctrl_top_right.prepend(button);
    button.addEventListener("click", openJosmDialog);
}

async function openJosmDialog(e)
{
    let response,
      message,
      heatmap_url_manual_copy,
      heatmap_url_click,
      base_heatmap_url;

    let map_color = document.querySelector(".map-color.active").getAttribute("data-color");
    let map_type = document.querySelector(".map-type.active").getAttribute("data-type");

    try {
        response = await browser.runtime.sendMessage({
            "name": "getHeatmapUrl",
            "map_color": map_color ?? "hot",
            "map_type": map_type ?? "all"
        });
        if (response.error) {
            message = "Error: missing cookies"
            heatmap_url_manual_copy = "One or more cookies not found - 'CloudFront-Key-Pair-Id', 'CloudFront-Policy', 'CloudFront-Signature'"
        } else {
            base_heatmap_url = response.heatmap_url;
            heatmap_url_manual_copy = "tms:" + base_heatmap_url;
            heatmap_url_click =
              "http://127.0.0.1:8111/imagery?title=Strava&type=tms&max_zoom=15&url=" +
              base_heatmap_url;
            message = "Open heatmap in editor"
        }
    } catch(err) {
        console.log(err)
        message = "Unknown error - check console"
        heatmap_url_manual_copy = "couldn't build url"
    }

    document.querySelector('#josm-modal-message').textContent = message
    document.querySelector('#josm-imagery-url').textContent = heatmap_url_manual_copy
    document.querySelector("#josm-click-to-load").href = heatmap_url_click
    document.querySelector('#josm-modal').classList.add('active');
    document.querySelector("#josm-click-to-copy").addEventListener("click", copyUrlToClipboard);
}

function copyUrlToClipboard() {
    let heatmapUrlManualCopy = document.querySelector("#josm-imagery-url").innerHTML;
    navigator.clipboard.writeText(heatmapUrlManualCopy);
}