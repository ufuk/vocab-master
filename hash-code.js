/**
 * This function is copy & pasted from this answer:
 *
 * http://stackoverflow.com/a/15710692/3036625
 */
String.prototype.hashCode = function () {
    if (this.length === 0) return 0;
    return this.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    }, 0);
};

JSON.hashCode = function (obj) {
    return JSON.stringify(obj).hashCode();
};
