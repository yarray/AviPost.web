const loadFile = file => {
    const reader = new FileReader();
    return new Promise(resolve => {
        reader.onload = progress => resolve(progress.target.result);
        reader.readAsDataURL(file);
    });
};

module.exports = { loadFile };
