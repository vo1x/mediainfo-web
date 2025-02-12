import { Context } from "hono";

import { getMetadata, isDriveId } from "../services/gdriveService";
import { parseMediaInfo } from "../utils/parser";
import { fetchMediaInfoFromGDrive } from "../services/mediainfo";

export const getMetadataController = async (c: Context) => {
  const driveId = c.req.query("driveId");

  if (!driveId) {
    return c.json({ message: "drive id is required" }, 404);
  }

  if (!isDriveId(driveId)) return c.json({ message: "Invalid drive ID" }, 404);

  const fileMetadata = await getMetadata(driveId);
  const isVideo = fileMetadata?.mimeType.includes("video");

  if (!isVideo)
    return c.json(
      {
        message: "Only video files are allowed",
      },
      404
    );

  const mediaInfo = await fetchMediaInfoFromGDrive(driveId);

  if (mediaInfo.success) {
    if (!mediaInfo) {
      return c.json(
        {
          message: "unable to extract mediainfo",
        },
        404
      );
    } else {
      const parsedMediaInfo = parseMediaInfo(mediaInfo.mediaInfo, fileMetadata);
      return c.json(
        {
          parsedMediaInfo,
        },
        200
      );
    }
  }

  return c.json(
    {
      message: mediaInfo.message,
    },
    200
  );
};
