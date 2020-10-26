const S3 = require("../config/aws");

async function deleteSubFolders(folder, cloud) {
  folder.files.forEach((fileId) => {
    const fileIndex = cloud.files.findIndex(
      (file) => file.id === fileId.toString()
    );
    const awsKey = cloud.files[fileIndex].awsData.key;
    cloud.storage =
      +cloud.storage + (+cloud.files[fileIndex].size / 1024) * 10 ** -6;
    cloud.files.splice(fileIndex, 1);
    S3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: awsKey,
    })
      .promise()
      .then((data) => {
        // cloud.files.splice(fileIndex, 1);
        // cloud.save();
      })
      .catch((error) => console.log(error.message, "AWS did not deleted it."));
  });
  if (folder.folders.length === 0) {
    return;
  }
  // folder.folders.forEach((folderId) => {
  //   const subFolderIndex = cloud.folders.findIndex(
  //     (folder) => folder.id === folderId.toString()
  //   );
  //   deleteSubFolders(cloud.folders[subFolderIndex], cloud);
  //   cloud.folders.splice(subFolderIndex, 1);
  // });
  folder.folders.forEach((Folder) => {
    const subFolderIndex = cloud.folders.findIndex(
      (folder) => folder.id === Folder.id.toString()
    );
    deleteSubFolders(cloud.folders[subFolderIndex], cloud);
    cloud.folders.splice(subFolderIndex, 1);
  });
}

function deleteFiles(folder, cloud) {
  console.log(folder.folders);
  if (folder.folders.length === 0) {
    return;
  }
  // folder.files.forEach((fileId) => {
  //   const subFolderIndex = cloud.files.findIndex(
  //     (folder) => folder.id === fileId.toString()
  //   );
  //   deleteSubFolders(cloud.folders[subFolderIndex], cloud);
  //   cloud.folders.splice(subFolderIndex, 1);
  // });
  folder.files.forEach((file) => {
    const subFolderIndex = cloud.files.findIndex(
      (folder) => folder.id === file.id.toString()
    );
    deleteSubFolders(cloud.folders[subFolderIndex], cloud);
    cloud.folders.splice(subFolderIndex, 1);
  });
}

module.exports = {
  deleteSubFolders,
  deleteFiles,
};
