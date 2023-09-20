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

	const contents: IContent[] = playeRemote ? getContents(smilObject) : [
		{
			uid: 'video-1.mp4',
			uri: 'https://static.signageos.io/assets/video-test-1_e07fc21a7a72e3d33478243bd75d7743.mp4'
		},
		{
			uid: 'video-1.mp4',
			uri: 'https://static.signageos.io/assets/video-test-1_e07fc21a7a72e3d33478243bd75d7743.mp4'
		},
		{
			uid: 'img-1.png',
			uri: 'https://static.signageos.io/assets/android-benq-amy_bbd9afbc0655ceb6da790a80fbd90290.png'
		},
		{
			uid: 'img-2.png',
			uri: 'https://static.signageos.io/assets/android-nec-roberto_3f9b985e2214b59e3d1f296e69e86fdd.png'
		},
		{
			uid: 'img-3.png',
			uri: 'https://static.signageos.io/assets/android-panasonic-pikachu_347af960f123f7c56f5f967882108bdf.png'
		},
		{
			uid: 'img-4.png',
			uri: 'https://static.signageos.io/assets/brightsign-4.7-nelson_9fed77987aac013a712eed87adbcf0d9.png'
		},
		{
			uid: 'img-5.png',
			uri: 'https://static.signageos.io/assets/chrome-os-krusty_99c97ad4680ccf06517b220b61327a5c.png'
		},
		{
			uid: 'video-2.mp4',
			uri: 'https://static.signageos.io/assets/video-test-2_e2ffa51f6a4473b815f39e7fb39239da.mp4'
		},
		{
			uid: 'img-6.png',
			uri: 'https://static.signageos.io/assets/sssp-2.0-burns_2a17095aec4332358d91b47999862647.png'
		},
		{
			uid: 'img-7.png',
			uri: 'https://static.signageos.io/assets/sssp-3.0-maggie_47dfc4c8c21b49c5d6f0ef1505ece49c.png'
		},
		{
			uid: 'img-8',
			uri: 'https://static.signageos.io/assets/tizen-2.4-bart_96c02fbd2df936e8bdd0b345f8874224.png'
		},
		{
			uid: 'img-9.png',
			uri: 'https://static.signageos.io/assets/tizen-3.0-apu_e300ee67c93b616ee36f51202234d429.png'
		},
		{
			uid: 'video-3.mp4',
			uri: 'https://static.signageos.io/assets/video-test-3_5cfd717df750e5b1d5dd8384c194a92d.mp4'
		},
		{
			uid: 'img-10.png',
			uri: 'https://static.signageos.io/assets/webos-1.0-krabappel_60b520b38756789dce877dc2feac92fb.png'
		},
		{
			uid: 'img-11.png',
			uri: 'https://static.signageos.io/assets/webos-2.0-farnsworth_413fc194707fdeb82052b3e2541fb50a.png'
		},
		{
			uid: 'img-12.png',
			uri: 'https://static.signageos.io/assets/webos-3.0-zapp_951665bdb0a145befd8cf9382c93bd77.png'
		},
		{
			uid: 'img-13.png',
			uri: 'https://static.signageos.io/assets/webos-3.2-bender_19043283cc5147bf441265fc494a0505.png'
		},
	];

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