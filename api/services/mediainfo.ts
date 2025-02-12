import MediaInfo from "mediainfo.js";

export async function fetchMediaInfoFromGDrive(fileId: string) {
  const apiKey = `AIzaSyDc8qlDH2gjT0liG-pAs-IpDDVtO7134K4`;
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
  const rangeHeader = { Range: "bytes=0-10485760" };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: rangeHeader,
    });

    if (!response.ok && response.status !== 206) {
      throw new Error(`Failed to fetch chunk: Status code ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    const mediaInfo = await MediaInfo({
      locateFile: (filename) => {
        return `/${filename}`;
      },
    });

    const mediaData = await mediaInfo.analyzeData(
      () => buffer.byteLength,
      (chunkSize) => {
        return new Uint8Array(buffer.slice(0, chunkSize));
      }
    );

    return {
      success: true,
      mediaInfo: mediaData,
    };
  } catch (error) {
    console.error("MediaInfo error:", error);
    return {
      success: false,
      message: `Error occurred: ${(error as Error).message}`,
    };
  }
}
