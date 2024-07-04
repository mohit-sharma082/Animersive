// import RNFS from 'react-native-fs';
// import axios from 'axios';


/**

Downloaded  M3U8 DATA : 
    #EXTM3U
    #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1818034,RESOLUTION=1920x1080,FRAME-RATE=25.000,CODECS="avc1.640032,mp4a.40.2"
    index-f1-v1-a1.m3u8
    #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=954469,RESOLUTION=1280x720,FRAME-RATE=25.000,CODECS="avc1.64001f,mp4a.40.2"
    index-f2-v1-a1.m3u8
    #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=490508,RESOLUTION=640x360,FRAME-RATE=25.000,CODECS="avc1.64001e,mp4a.40.2"
    index-f3-v1-a1.m3u8

    #EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=191950,RESOLUTION=1920x1080,CODECS="avc1.640032",URI="iframes-f1-v1-a1.m3u8"
    #EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=103158,RESOLUTION=1280x720,CODECS="avc1.64001f",URI="iframes-f2-v1-a1.m3u8"
    #EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=40289,RESOLUTION=640x360,CODECS="avc1.64001e",URI="iframes-f3-v1-a1.m3u8"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 TS URL  [
    "https://ed.netmagcdn.com:2228/hls-playback/f877ebeebe0a613047d4e5f85385c11177b24cda7bdbccf58bcebc6e66fd986ce939105fd66efa1102caf0426823823858979302fff2e4f8799fefce2b3bd3c1801e578285622e8e775772dcecde4f532caccfc531ea99229b97175f819f0c284304fa05f14f162af606532376065b39d8d364bd7c9342f0
    25b24aa66b8ddb8cca7b10f5217cb23a458b3c8b1399a9ce/master.m3u8/index-f1-v1-a1.m3u8",
    "https://ed.netmagcdn.com:2228/hls-playback/f877ebeebe0a613047d4e5f85385c11177b24cda7bdbccf58bcebc6e66fd986ce939105fd66efa1102caf0426823823858979302fff2e4f8799fefce2b3bd3c1801e578285622e8e775772dcecde4f532caccfc531ea99229b97175f819f0c284304fa05f14f162af606532376065b39d8d364bd7c9342f025b24aa66b8ddb8cca7b10f5217cb23a458b3c8b1399a9ce/master.m3u8/index-f2-v1-a1.m3u8", 
    "https://ed.netmagcdn.com:2228/hls-playback/f877ebeebe0a613047d4e5f85385c11177b24cda7bdbccf58bcebc6e66fd986ce939105fd66efa1102caf0426823823858979302fff2e4f8799fefce2b3bd3c1801e578285622e8e775772dcecde4f532caccfc531ea99229b97175f819f0c284304fa05f14f162af606532376065b39d8d364bd7c9342f025b24aa66b8ddb8cca7b10f5217cb23a458b3c8b1399a9ce/master.m3u8/index-f3-v1-a1.m3u8"
  ]
 
 
 
 */

// export class DownloadUtility {
//     static download = async (m3u8Url, progressCallback) => {
//         try {
//             // Step 1: Download the .m3u8 file
//             const response = await axios.get(m3u8Url);
//             const m3u8Content = response.data;

//             console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
//             console.log(`Downloaded  M3U8 DATA : `, m3u8Content);
//             console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);

//             // Step 2: Parse the .m3u8 file to find .ts files
//             const tsUrls = m3u8Content
//                 .split('\n')
//                 .filter((line) => line && !line.startsWith('#'))
//                 .map((line) => new URL(line, m3u8Url).toString());


//             console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
//             console.log(`TS URL `, tsUrls);
//             console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);

//             // Step 3: Create a directory for the downloaded files
//             const downloadDir = `${RNFS.DocumentDirectoryPath}/downloads/ANIMERSIVE`;
//             await RNFS.mkdir(downloadDir);

//             // Step 4: Download each .ts file using RNFS.downloadFile
//             const totalFiles = tsUrls.length;
//             let downloadedFiles = 0;

//             const downloadPromises = tsUrls.map(async (tsUrl, index) => {
//                 const tsFilePath = `${downloadDir}/file${index}.ts`;

//                 const downloadOptions = {
//                     fromUrl: tsUrl,
//                     toFile: tsFilePath,
//                     background: true,
//                     begin: (res) => {
//                         console.log('Download started:', res.jobId);
//                     },
//                     progress: (res) => {
//                         const progress = res.bytesWritten / res.contentLength;
//                         progressCallback((downloadedFiles + progress) / totalFiles);
//                     },
//                 };

//                 const result = await RNFS.downloadFile(downloadOptions).promise;
//                 if (result.statusCode === 200) {
//                     downloadedFiles += 1;
//                     progressCallback(downloadedFiles / totalFiles);
//                     console.log(`Downloaded file: ${tsFilePath}`);
//                 } else {
//                     console.log(`Failed to download file: ${tsUrl}`);
//                 }
//                 return tsFilePath;
//             });

//             // Wait for all .ts files to be downloaded
//             const tsFilePaths = await Promise.all(downloadPromises);

//             console.log('Downloaded files:', tsFilePaths);
//         } catch (error) {
//             console.error('Error downloading .m3u8 file:', error);
//         }
//     };
// }











// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import axios from 'axios';
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

export class DownloadUtility {


    // static async requestStoragePermission() {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //             {
    //                 title: 'Storage Permission Required',
    //                 message: 'This app needs access to your storage to download files',
    //                 buttonPositive: 'OK',
    //             }
    //         );

    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('Permission Granted');
    //             return true;
    //         } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    //             console.log('Permission Denied: Never Ask Again');
    //             Alert.alert(
    //                 'Permission Denied',
    //                 'Storage permission is required to download files. Please enable it in the app settings.',
    //                 [
    //                     {
    //                         text: 'Cancel',
    //                         style: 'cancel',
    //                     },
    //                     {
    //                         text: 'Open Settings',
    //                         onPress: () => Linking.openSettings(),
    //                     },
    //                 ]
    //             );
    //             return false;
    //         } else {
    //             console.log('Permission Denied');
    //             return false;
    //         }
    //     } catch (error) {
    //         console.warn('Permission Error:', error);
    //         return false;
    //     }
    // }

    static async downloadM3U8File(m3u8Url, quality = 'highest') {
        try {
            // const hasPermission = await this.requestStoragePermission();
            // if (!hasPermission) {
            //     Alert.alert('Permission Denied', 'Storage permission is required to download files');
            //     return;
            // }
            const outputPath = `${RNFS.DocumentDirectoryPath}/animersive-video.mp4`;

            const { data: m3u8Content } = await axios.get(m3u8Url);
            const lines = m3u8Content.split('\n');
            console.log(`Downloaded  M3U8 DATA : `, JSON.stringify(lines, 0, 4));

            // Parse the m3u8 file to get the available qualities and segments
            const qualities = await this.parseM3U8(lines, m3u8Url);
            const selectedQuality = this.selectQuality(qualities, quality);

            // Download and concatenate the segments
            await this.downloadAndConcatenateSegments(selectedQuality.segments, outputPath);

            console.log(`Download completed: ${outputPath}`);
        } catch (error) {
            console.error('Error downloading the file', error);
        }
    }

    static async parseM3U8(lines, baseUrl) {
        const qualities = [];
        let currentQuality = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('#EXT-X-STREAM-INF')) {
                const bandwidth = this.extractBandwidth(line);
                currentQuality = { bandwidth, segments: [] };
                qualities.push(currentQuality);
            } else if (line.endsWith('.m3u8')) {
                const playlistUrl = this.getAbsoluteUrl(baseUrl, line);
                const { data: subM3U8Content } = await axios.get(playlistUrl);
                const subLines = subM3U8Content.split('\n');
                currentQuality.segments = this.parseSegments(subLines, playlistUrl);
            }
        }
        console.log(`RETURNING QUALITIES => `, JSON.stringify(qualities, 0, 4));

        return qualities;
    }

    static getAbsoluteUrl(baseUrl, relativeUrl) {
        const base = new URL(baseUrl);
        return new URL(relativeUrl, base).toString();
    }

    static parseSegments(lines, baseUrl) {
        return lines.filter(line => line.endsWith('.ts')).map(line => this.getAbsoluteUrl(baseUrl, line));
    }

    static extractBandwidth(line) {
        const match = line.match(/BANDWIDTH=(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    static selectQuality(qualities, quality) {
        if (quality === 'highest') {
            return qualities.reduce((max, q) => (q.bandwidth > max.bandwidth ? q : max), qualities[0]);
        }
        if (quality === 'lowest') {
            return qualities.reduce((min, q) => (q.bandwidth < min.bandwidth ? q : min), qualities[0]);
        }
        // Add more quality selection logic if needed
        return qualities[0];
    }

    static async downloadAndConcatenateSegments(segments, outputPath) {
        console.log(`Downloading and concatenating segments... `, segments, outputPath);
        const tempDir = `${RNFS.DocumentDirectoryPath}/temp`;
        await RNFS.mkdir(tempDir);

        for (let i = 0; i < segments.length; i++) {
            const segmentUrl = segments[i];
            const segmentPath = `${tempDir}/segment${i}.ts`;
            await this.downloadSegment(segmentUrl, segmentPath);
        }

        const files = await RNFS.readDir(tempDir);
        const segmentPaths = files.map(file => file.path);

        await this.concatenateSegments(segmentPaths, outputPath);
        await RNFS.unlink(tempDir);
    }

    static async downloadSegment(segmentUrl, segmentPath) {
        const { data } = await axios.get(segmentUrl, { responseType: 'arraybuffer' });
        await RNFS.writeFile(segmentPath, data, 'base64');
    }

    static async concatenateSegments(segmentPaths, outputPath) {
        for (const segmentPath of segmentPaths) {
            const segmentData = await RNFS.readFile(segmentPath, 'base64');
            console.log(`Writing segment to file: ${segmentPath} (${segmentData.length} bytes)`);
            await RNFS.appendFile(outputPath, segmentData, 'base64');
        }
    }


    static async downloadtest(url) {
        try {

            // {
            //     fromUrl: string // URL to download file from
            //     toFile: string // Local filesystem path to save the file to
            //     headers?: Headers // An object of headers to be passed to the server
            //     progressInterval?: number
            //     progressDivider?: number
            //     begin?: (res: DownloadBeginCallbackResult) => void
            //     progress?: (res: DownloadProgressCallbackResult) => void
            //     connectionTimeout?: number // only supported on Android yet
            //     readTimeout?: number // supported on Android and iOS
            // }
            const outputPath = `${RNFS.DocumentDirectoryPath}/animersive-video.mp4`;


            const res = await RNFS.downloadFile({
                fromUrl: url,
                toFile: outputPath,
                begin: (res) => {
                    console.log(`=> BEGIN => `, JSON.stringify(res, 0, 4));
                },
                progress: (res) => {
                    console.log(`\n=> PROGRESS => `, JSON.stringify(res, 0, 4));
                },
                progressInterval: 1
            })

        } catch (error) {
            console.log(`ERror in test function => `, error);
        }
    }
}
