import { formatBytes } from "./formatBytes";
import { formatDuration } from "./formatDuration";

import { DriveFileMetadata, ParsedMediaInfo } from "../types";

export function parseMediaInfo(
  mediaInfo: any,
  driveMetadata: DriveFileMetadata
): ParsedMediaInfo {
  const fileName = driveMetadata.name;
  const fileFormat = driveMetadata.mimeType;

  const generalInfo = mediaInfo.media.track.find(
    (track: any) => track["@type"] === "General"
  );
  const videoInfo = mediaInfo.media.track.find(
    (track: any) => track["@type"] === "Video"
  );

  const audioTracks = mediaInfo.media.track.filter(
    (track: any) => track["@type"] === "Audio"
  );
  const subtitleTracks = mediaInfo.media.track.filter(
    (track: any) => track["@type"] === "Text"
  );

  const overallBitRate =
    (parseFloat(driveMetadata.size!) * 8) /
    parseFloat(generalInfo.Duration) /
    1000000;

  const mergedInfo: ParsedMediaInfo = {
    fileName,
    fileFormat,
    general: {
      uniqueId: generalInfo.UniqueID,
      container: generalInfo.Format,
      size: formatBytes(parseInt(generalInfo.FileSize)),
      runtime: formatDuration(parseFloat(generalInfo.Duration)),
      overallBitRate,
      frameRate: generalInfo.FrameRate,
      encoder: generalInfo.Encoded_Application || "Unknown",
      encoderLib: generalInfo.Encoded_Library || "Unknown",
      createdAt: generalInfo.Encoded_Date || "Unknown",
    },
    video: {
      uniqueId: videoInfo.UniqueID,
      codec: videoInfo.Format,
      formatProfile: videoInfo.Format_Profile,
      formatLevel: videoInfo.Format_Level,
      formatTier: videoInfo.Format_Tier,
      resolution: `${videoInfo.Width}x${videoInfo.Height}`,
      aspectRatio: videoInfo.DisplayAspectRatio,
      frameRate: parseFloat(videoInfo.FrameRate),
      bitDepth: `${videoInfo.BitDepth} bits`,
      colorSpace: videoInfo.ColorSpace || "Unknown",
      chromaSubsampling: videoInfo.ChromaSubsampling || "Unknown",
      delay: videoInfo.Delay || "0 ms",
      transferChar: videoInfo.transfer_characteristics || "Unknown",
      matCoeff: videoInfo.matrix_coefficients || "Unknown",
    },
    audio: audioTracks.map((track: any) => ({
      language: track.Language || "und",
      channels: track.ChannelLayout || `${track.Channels || "N/A"} channels`,
      codec: track.Format,
      bitRate: `${parseInt(track.BitRate) / 1000 || "N/A"} kbps`,
      isDefault: track.Default === "Yes",
      title: track.Title || "Unknown",
    })),
    subtitles: subtitleTracks.map((track: any) => ({
      index: parseInt(track.ID),
      language: track.Language || "und",
      encoding: track.Format || "Unknown",
      title: track.Title || "Unknown",
    })),
  };

  return mergedInfo;
}
