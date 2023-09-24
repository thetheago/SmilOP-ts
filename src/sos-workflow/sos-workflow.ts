import sos from '@signageos/front-applet';

import { getImgElement } from '..';
import { IContent, IPlaylist } from './types';

async function saveContentIntoOfflineCacheAndFillData(playlists: IPlaylist[]): Promise<void> {
	await Promise.all(playlists.map(async (playlist) => {
        return Promise.all(playlist.contents.map(async (content: IContent) => {
            // Store files to offline storage (https://sdk.docs.signageos.io/api/js/content/latest/js-offline-cache-media-files)
            const { filePath } = await sos.offline.cache.loadOrSaveFile(content.uid, content.uri);
            content.filePath = filePath;
            content.arguments = [filePath, 0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight];
            return content;
        }));
	}));
}

async function playContent(content: IContent) {
    if (content.uid.indexOf('video-') === 0) {
        await sos.video.play(...content.arguments);
    }
    if (content.uid.indexOf('img-') === 0) {
        getImgElement(...content.arguments).style.display = 'block';
    }
    content.playing = true;
}

async function stopContent(content: IContent) {
    if (content.playing) {
        if (content.uid.indexOf('video-') === 0) {
            await sos.video.stop(...content.arguments);
        }
        if (content.uid.indexOf('img-') === 0) {
            const imgElement = getImgElement(...content.arguments) as HTMLImageElement;
            imgElement.src = '';
            imgElement.setAttribute('data-args', '');
            imgElement.style.display = 'none';
        }
        content.playing = false;
    }
}

async function prepareContent(content: IContent) {
    if (content.uid.indexOf('video-') === 0) {
        await sos.video.prepare(...content.arguments);
    }
    if (content.uid.indexOf('img-') === 0) {
        const imgElement = getImgElement(...content.arguments) as HTMLImageElement;
        imgElement.src = content.filePath;
        imgElement.setAttribute('data-args', JSON.stringify(content.arguments));
    }
}

async function waitEndedContent(content: IContent) {
    if (content.uid.indexOf('video-') === 0) {
        await sos.video.onceEnded(...content.arguments);
    }
    if (content.uid.indexOf('img-') === 0) {
        await new Promise((resolve) => setTimeout(resolve, 3e3));
    }
}

export { saveContentIntoOfflineCacheAndFillData, playContent, stopContent, prepareContent, waitEndedContent, IContent }
