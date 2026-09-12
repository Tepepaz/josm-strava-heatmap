# JOSM Strava Heatmap

A browser extension that makes it easy to use the [Strava Global Heatmap](https://www.strava.com/heatmap) as TMS imagery in [JOSM](https://josm.openstreetmap.de/), [iD](https://www.openstreetmap.org), and other OpenStreetMap editors.

Accessing Strava's high-resolution global heatmap in OSM editors requires authenticated CloudFront cookies (`CloudFront-Key-Pair-Id`, `CloudFront-Policy`, `CloudFront-Signature`, `_strava_idcf`). These cookies periodically expire. This extension automatically extracts the cookies from your active Strava session and constructs the ready-to-use TMS imagery URL with a single click.

---

## Features

- **One-Click Integration**: Send the heatmap directly to JOSM (via Remote Control) or open it in the iD web editor.
- **Copy-Ready TMS URL**: Copies the full TMS tile URL including authentication cookies for manual layer configuration.
- **Modern Strava Compatibility**: Built for modern Strava maps and single-page application (SPA) navigation.
- **Sport & Color Support**: Automatically detects your selected activity type (All, Ride, Run, Water, Winter) and color palette.

---

## Installation

Because this extension is installed from source as an unpacked browser extension, **you must first download the extension files to your computer**.

### Chrome / Edge / Brave / Opera

#### Step 1: Download the extension files
Choose one of the following methods:

- **Option A (ZIP Download - recommended)**:
  1. Click the green **Code** button at the top of this [GitHub repository](https://github.com/zekefarwell/josm-strava-heatmap).
  2. Select **Download ZIP**.
  3. Extract the downloaded `.zip` file to a permanent folder on your computer (e.g., in your Documents or a dedicated `extensions` folder).
  > **Note**: Do not delete or move this folder after installation, as the browser loads the extension files directly from this directory.

- **Option B (Git Clone)**:
  ```bash
  git clone https://github.com/zekefarwell/josm-strava-heatmap.git
  ```

#### Step 2: Load the extension into your browser
1. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
   - **Opera**: `opera://extensions/`
2. Turn on **Developer mode** using the toggle switch (usually in the top-right corner).
3. Click the **Load unpacked** button (top-left).
4. Select the folder containing the extension files (the folder that directly contains `manifest.json`).
5. The extension is now installed and ready to use.

---

## Usage

1. Go to [strava.com/heatmap](https://www.strava.com/heatmap) and log in with your Strava account (a free account is sufficient).
2. *(Optional)* Select your desired activity type (Ride, Run, Water, Winter, All) and heatmap color.
3. Click the **orange grid icon** in the top-right corner of the map viewport:

   ![Strava Heatmap Button](screenshot.png)

4. In the dialog that opens, choose how to use the imagery:
   - **Open in JOSM**: Automatically adds the heatmap layer to your running JOSM instance (requires [JOSM Remote Control](https://josm.openstreetmap.de/wiki/Help/Preferences/RemoteControl) to be enabled).
   - **Open in iD**: Opens the OpenStreetMap web editor with the custom heatmap background preset.
   - **Copy to Clipboard**: Copies the full TMS URL with cookie parameters to paste into any mapping software.

   ![Modal Dialog](screenshot2.png)

---

## Editor Configuration

### JOSM Setup
- **Automatic**: Ensure JOSM is running and **Remote Control** is enabled in *Preferences > Remote Control > Enable remote control*. Then click **Open in JOSM** in the extension popup.
- **Manual**: In JOSM, open *Preferences > Imagery Preferences*, click **+ TMS**, and paste the copied URL into the URL field. Set the layer name to `Strava Heatmap`.

### iD Setup
- **Automatic**: Click **Open in iD** in the extension popup.
- **Manual**: In iD, open the **Backgrounds** panel (press `B`), scroll down to **Custom**, click the `...` button, and paste the copied URL into the custom imagery field.

---

## Supported Options

### Activity Types
Strava activities map to the following heatmap layers:
- **All Activities**: `all`
- **Ride / Cycling**: `ride`
- **Run / Walk / Hike**: `run`
- **Water Sports / Swimming**: `water`
- **Winter Sports / Skiing / Snowboarding**: `winter`

### Heatmap Colors
- `hot` (default)
- `blue`
- `purple`
- `gray`
- `bluered`
- `mobileblue`

---

## Cookie Expiration & Troubleshooting

- **Why did my heatmap stop loading?** Strava's CloudFront session cookies expire periodically (typically after 7–14 days). When tiles stop loading in JOSM or iD (e.g. 403 Forbidden errors), simply visit [strava.com/heatmap](https://www.strava.com/heatmap), click the extension button again, and re-add or update the layer URL in your editor.
- **Missing Cookies Error**: Make sure you are logged into your Strava account on `strava.com`. Logged-out sessions do not have access to full-resolution authenticated heatmap tiles.
- **Button Not Appearing**: Ensure the extension is enabled in `chrome://extensions`. Refresh the Strava page after enabling the extension.

---

## References

- [OpenStreetMap Wiki: Strava Heatmap](https://wiki.openstreetmap.org/wiki/Strava)
- [JOSM Remote Control Documentation](https://josm.openstreetmap.de/wiki/Help/Preferences/RemoteControl)
- [JOSM Imagery Preferences](https://josm.openstreetmap.de/wiki/Help/Preferences/Imagery)
