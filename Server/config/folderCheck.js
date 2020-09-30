module.exports = (folder, res) => {
    if (!folder) {
        return res.status(404).json({
            error: 'Folder not found.'
        })
    }
}