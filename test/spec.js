var assert = require('assert');
var fs = require('fs');
var inline = require('../src/inline.js');

function normalize(contents) {
    return (process.platform === 'win32' ? contents.replace(/\r\n/g, '\n') : contents);
}

function readFile(file) {
    return normalize(fs.readFileSync(file, 'utf8'));
}

function diff(actual, expected) {
    if (actual === expected)
    {
        return;
    }

    actual = actual.split('\n');
    expected = expected.split('\n');

    expected.forEach(function(line, i) {
        if (!line.length && i === expected.length - 1) {
            return;
        }
        var other = actual[i];
        if (line === other) {
            console.error('%d| %j%s | %j', i + 1, line, '', other);
        } else {
            console.error('\033[31m%d| %j%s | %j\033[0m', i + 1, line, '', other);
        }
    });
}

function testEquality(err, result, expected, done) {
    result = normalize(result);
    diff(result, expected);
    assert(!err);
    assert.equal(result, expected);
    done();
}

describe('html', function() {

    it('should inline local links', function(done) {
        var expected = readFile('test/cases/css_out.html');

        inline.html({
            fileContent: readFile('test/cases/css.html'),
            relativeTo: 'test/cases/',
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });

    it('should inline remote links', function(done) {
        var expected = readFile('test/cases/css-remote_out.html');

        inline.html({
            fileContent: readFile('test/cases/css-remote.html'),
            relativeTo: 'test/cases/',
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });

    it('should inline scripts', function(done) {
        var expected = readFile('test/cases/script_out.html');

        inline.html({
            fileContent: readFile('test/cases/script.html'),
            relativeTo: 'test/cases/',
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });

    it('should inline local images', function(done) {
        var expected = readFile('test/cases/img_out.html');

        inline.html({
            fileContent: readFile('test/cases/img.html'),
            relativeTo: 'test/cases/',
            images: true,
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });

    it('should inline remote images', function(done) {
        var expected = readFile('test/cases/img-remote_out.html');

        inline.html({
            fileContent: readFile('test/cases/img-remote.html'),
            relativeTo: 'test/cases/',
            images: true,
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });

    it('should inline based on inlineAttribute', function(done) {
        var expected = readFile('test/cases/img-opt-in_out.html');

        inline.html({
            fileContent: readFile('test/cases/img-opt-in.html'),
            relativeTo: 'test/cases/',
            //images: false, //default
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });
});

describe('css', function() {

    it('should inline local urls', function(done) {
        var expected = readFile('test/cases/css_out.css');

        inline.css({
            fileContent: readFile('test/cases/css.css'),
            relativeTo: 'test/cases/',
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });

    it('should inline remote urls', function(done) {
        var expected = readFile('test/cases/css-remote_out.css');

        inline.css({
            fileContent: readFile('test/cases/css-remote.css'),
            relativeTo: 'test/cases/',
            images: true,
            callback: function(err, result) {
                testEquality(err, result, expected, done);
            }
        });
    });
});