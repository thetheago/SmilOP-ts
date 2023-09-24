type IContentArguments = [
    uri: string,
    x: number,
    y: number,
    width: number,
    height: number,
]

interface IContent {
	/* Identificator of content */
	uid: string,
	/* Uri to the content */
	uri: string,
	/* Path to the file in the offline cache */
	filePath?: string,
	/* Details of where the content will play */
	arguments?: IContentArguments,
	/* If content is playing or not */
	playing?: boolean,
    /* Duration of content */
    duration?: number,
}

interface IPlaylist {
    /* What days of week this playlist must play, 0 (Sunday) to 6 (Saturday) */
    daysOfWeek?: Array<0 | 1 | 2 | 3 | 4 | 5 | 6>,
    /* Contents in playlist */
    contents: IContent[],
}

export { IContentArguments, IContent, IPlaylist }
