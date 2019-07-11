// prettier-ignore
/* eslint-disable */
var GetDocumentData = function() {};

GetDocumentData.prototype = {
  run: function(arguments) {
    arguments.completionFunction({ "url": document.URL, "document": document.documentElement.outerHTML, "title": document.title });
  }
};

var ExtensionPreprocessingJS = new GetDocumentData;
