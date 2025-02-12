const apiKey = `AIzaSyDc8qlDH2gjT0liG-pAs-IpDDVtO7134K4`;

export function getId(gdriveLink: string): string | null {
  const match = gdriveLink.match(/(?:drive|file)\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export const isDriveId: (driveId: string) => boolean = (driveId: string) => {
  return /^(tp:|sa:|mtp:)?(?:[a-zA-Z0-9-_]{33}|[a-zA-Z0-9_-]{19})$|^gdl$|^(tp:|mtp:)?root$/.test(
    driveId
  );
};

export async function getMetadata(fileId: string): Promise<any> {
  if (!fileId) {
    throw new Error("Invalid Google Drive URL");
  }

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true&fields=kind,id,name,mimeType,size,teamDriveId,driveId&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw error;
  }
}
