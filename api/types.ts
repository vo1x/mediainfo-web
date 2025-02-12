export interface AudioStream {
  language: string;
  channels: string;
  codec: string;
  bitRate: string;
  isDefault: boolean;
  title?: string;
}

export interface SubtitleStream {
  index: number;
  language: string;
  encoding: string;
  title?: string;
}

export interface ParsedMediaInfo {
  fileName: string;
  fileFormat: string;
  general: {
    uniqueId: string;
    container: string;
    size: string;
    runtime: string;
    overallBitRate: number;
    frameRate: string;
    encoder: string;
    encoderLib: string;
    createdAt: string;
  };
  video: {
    uniqueId: string;
    formatProfile: string;
    formatLevel: string;
    formatTier: string;
    codec: string;
    resolution: string;
    aspectRatio: string;
    frameRate: number;
    bitDepth: string;
    colorSpace: string;
    chromaSubsampling: string;
    delay: string;
    transferChar: string;
    matCoeff: string;
  };
  audio: Array<AudioStream>;
  subtitles: Array<SubtitleStream>;
}

export interface DriveFileMetadata {
  name: string;
  mimeType: string;
  size?: string;
  videoMediaMetadata?: {
    durationMillis?: string;
    width?: number;
    height?: number;
  };
}
