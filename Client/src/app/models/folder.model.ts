export class Folder {
  constructor(
    public id: string,
    public name: string,
    public files: [string],
    public folders: [string],
    public location: string,
    public sharable: boolean,
    public sharedWith: [string],
    public sharableLink: string
  ) {}
}
