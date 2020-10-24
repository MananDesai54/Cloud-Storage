export class File {
  constructor(
    public name: string,
    public fileType: string,
    public size: number,
    public mimeType: string,
    public location: string,
    public fileUrl: string,
    public sharable: boolean,
    public sharedWith: [string],
    public sharableLink: string
  ) {}
}
