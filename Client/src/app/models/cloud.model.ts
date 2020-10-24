import { File } from './file.model';
import { Folder } from './folder.model';

export class CloudModel {
  constructor(
    public userId: string,
    public files: [File],
    public folders: [Folder],
    public storage: number
  ) {}
}
