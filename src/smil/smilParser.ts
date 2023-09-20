import { Document, Node } from "xml-parser";

import { IContent } from "../sos-workflow";

async function fetchAndParseSmilFile(url: string): Promise<Document> {
    let parse = require('xml-parser');

    return fetch(url)
            .then(response => response.text())
            .then(xmlData => parse(xmlData))
            .catch(error => {
                console.error('Ocorreu um erro ao buscar o arquivo SMIL:', error);
            });
}

function getContents(smilObject: Document): IContent[] {
    try {
        const mainParElement = smilObject.root.children.at(1).children.at(0).children.at(1);
        const mainSeqElement = mainParElement.children.at(0);
        const daysOfWeak     = mainSeqElement.children.filter(childrens => childrens.name === 'seq');

        // If have no seq inside main seq it means that all the days are the same playlist.
        if (daysOfWeak.length === 0) {
            
            const midias = mainSeqElement.children.map(function transformMidia(midia) {
                return {
                    uid: `${midia.name}-${midia.attributes.src.split("/").pop().split('.')[0]}`,
                    uri: midia.attributes.src,
                    duration: parseInt(midia.attributes.dur),
                }
            })

            return midias as IContent[];
        }

        // Pega os dias que irao tocar cada midia
        // debugger


        return [];
    } catch (error) {
        
    }
}

export { fetchAndParseSmilFile, getContents }
