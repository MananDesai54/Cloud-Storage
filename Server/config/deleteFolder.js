async function deleteFunction (folder, cloud, res) {
    if(folder.folders.length === 0) {
        return;
    }
    folder.folders.forEach(folderId => {
        const subFolderIndex = cloud.folders.findIndex(folder => folder.id === folderId.toString());
        deleteFunction(cloud.folders[subFolderIndex], cloud, res);
        cloud.folders.splice(subFolderIndex, 1);
    });
}

module.exports = deleteFunction;