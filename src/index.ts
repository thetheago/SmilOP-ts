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
import { fetchAndParseSmilFile, getContents } from './smil';
import { defaultPlaylist } from './utils'

const contentElement = document.getElementById('index');
const imgElements = [document.getElementById('img-1'), document.getElementById('img-2')]

export function getImgElement(...args: [string, number, number, number, number]) {
	return imgElements.find((imgElement) => imgElement.getAttribute('data-args') === JSON.stringify(args)) ||
		imgElements.find((imgElement) => imgElement.style.display === 'none');
}

// Wait on sos data are ready (https://sdk.docs.signageos.io/api/js/content/latest/js-applet-basics)
sos.onReady().then(async function main() {
	const playeRemote = true;
	const smilObject = await fetchAndParseSmilFile('http://url');

	const contents: IContent[] = playeRemote ? getContents(smilObject) : defaultPlaylist;

	await saveContentIntoOfflineCacheAndFillData(contents);

	contentElement.innerHTML = '';

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
});