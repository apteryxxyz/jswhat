const nf = require('node-fetch');

module.exports = function url(link) {
    const expression = /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
    const isLink = link.match(expression);
    if (!isLink) return false;

    return {
        fetch: () => nf(link).then(res => res.text()),
    };
};
