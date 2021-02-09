module.exports = {
    filenamer(file) {
        let cmd;
        cmd = file.split('.js', '');
        console.log('ya');
        return cmd;
    }
}