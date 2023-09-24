require('./index.css');

import sos from '@signageos/front-applet';

import {
	IContent,
	playContent, 
	stopContent, 
	prepareContent, 
	waitEndedContent,
	saveContentIntoOfflineCacheAndFillData,
} from './sos-workflow';
import { fetchAndParseSmilFile, getPlaylists, getTodayContents } from './smil';
import { defaultPlaylist } from './utils'
import { IContentArguments, IPlaylist } from './sos-workflow/types';

const contentElement = document.getElementById('index');
const imgElements = [document.getElementById('img-1'), document.getElementById('img-2')]

export function getImgElement(...args: IContentArguments) {
	return imgElements.find((imgElement) => imgElement.getAttribute('data-args') === JSON.stringify(args)) ||
		imgElements.find((imgElement) => imgElement.style.display === 'none');
}

// Wait on sos data are ready (https://sdk.docs.signageos.io/api/js/content/latest/js-applet-basics)
sos.onReady().then(async function main() {
	try {
		const playeRemote = true;
		const smilObject = await fetchAndParseSmilFile('https://s3.amazonaws.com/4yousee-files-test/qaplayer/common/smil/player.364.smil');
	
		const playlists: IPlaylist[] = playeRemote ? getPlaylists(smilObject) : defaultPlaylist;
	
		await saveContentIntoOfflineCacheAndFillData(playlists);
	
		contentElement.innerHTML = '';
	
		const contents = getTodayContents(playlists);

		await prepareContent(contents[0]);
	
		for (let i = 0; true; i = (i + 1) % contents.length) {
			const previousContent = contents[(i + contents.length - 1) % contents.length];
			const currentContent = contents[i];
			const nextContent = contents[(i + 1) % contents.length];
	
			await playContent(currentContent);
			if (currentContent.filePath !== previousContent.filePath) {
				// beware of stopping video in case you play the same video in a loop
				// otherwise you might get black gap or interrupted playback
				await stopContent(previousContent);
			}
			if (currentContent.filePath !== nextContent.filePath) {
				// beware of preparing video in case you play the same video in a loop
				// otherwise you might get black gap or interrupted playback
				await prepareContent(nextContent);
			}
			await waitEndedContent(currentContent);
		}
	} catch (error) {
		throw new Error(error);
	}
});