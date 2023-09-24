import { Document } from "xml-parser";

import { IContent } from "../sos-workflow";
import { IPlaylist } from "../sos-workflow/types";

async function fetchAndParseSmilFile(url: string): Promise<Document> {
    let parse = require('xml-parser');

    return fetch(url)
            .then(response => response.text())
            .then(xmlData => parse(xmlData))
            .catch(error => {
                console.error('Ocorreu um erro ao buscar o arquivo SMIL:', error);
                throw `Ocorreu um erro ao buscar o arquivo SMIL: ${error}`;
            });
}

function getPlaylists(smilObject: Document): IPlaylist[] {
    try {
        const mainParElement = smilObject.root.children.at(1).children.at(0).children.at(1);
        const mainSeqElement = mainParElement.children.at(0);
        const playlists      = mainSeqElement.children.filter(childrens => childrens.name === 'seq');

        // If have no seq inside mainSeqElement it means that all the days are the same playlist.
        if (playlists.length === 0) {
            
            const contents: IContent[] = mainSeqElement.children.map(function transformMidia(midia) {
                return {
                    uid: `${midia.name}-${midia.attributes.src.split("/").pop().split('.')[0]}`,
                    uri: midia.attributes.src,
                    duration: parseInt(midia.attributes.dur),
                }
            })

            return [{contents: contents}];
        }

        const regex = /adapi-weekday\(\)=(\d+)/g;
        const playlistsParsed: IPlaylist[] = playlists.map(function parsePlaylist(playlist) {
            const days: number[] = [];
            let match;
            while ((match = regex.exec(playlist.attributes.expr)) !== null) {
                days.push(parseInt(match[1], 10));
            }

            const contents: IContent[] = playlist.children.map(function transformMidia(midia) {
                return {
                    uid: `${midia.name}-${midia.attributes.src.split("/").pop().split('.')[0]}`,
                    uri: midia.attributes.src,
                    duration: parseInt(midia.attributes.dur),
                }
            })

            return {
                daysOfWeek: days,
                contents: contents,
            } as IPlaylist

        });

        return playlistsParsed;
    } catch (error) {
        throw `Failed to parse Smil File: ${error}`;
    }
}

function getTodayContents(playlists: IPlaylist[]): IContent[] {
    if (playlists.length === 1) return playlists[0].contents;
    
    const todayDay      = new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const todayPlaylist = playlists.find((playlist) => playlist.daysOfWeek.includes(todayDay));
    return todayPlaylist.contents;

    
}

export { fetchAndParseSmilFile, getPlaylists, getTodayContents }
