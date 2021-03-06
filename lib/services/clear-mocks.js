var path = require('path');
var di = require('di');
var fs = require('fs');
var _ = require('lodash');

var Logger = require('./logger');

function ClearMocks(logger) {
  function clearMocks(filetypes, config) {
    var mocksDir = path.join(config.mocksPath, config.name);
    logger.verboseLog('Clearing mock directory: ' + mocksDir);
    fs.readdirSync(mocksDir).forEach(function(filename) {
      if (_.contains(filetypes, path.extname(filename))) {
        fs.unlinkSync(path.join(mocksDir, filename));
        logger.verboseLog('Deleted: ' + filename);
      }
    });
  }

  this.clearOverrides = function(config) {
    clearMocks(['.override'], config);
  };

  this.clear = function(config) {
    if (config.clearOnStart && _.contains(['record', 'mockrecord'], config.mode)) {
      clearMocks(['.404', '.json', '.override'], config);
    }
  };
}

di.annotate(ClearMocks, new di.Inject(Logger));

module.exports = ClearMocks;