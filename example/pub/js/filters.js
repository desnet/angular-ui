/* Filters */

angular.module('filters', [])
    .filter('matchProp', [function () {

        var getAllStringProperties = function(obj) {
            var strings = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'string' && prop !== '$$hashKey') { // only get strings and ignore the $$hashKey property added by angularjs
                    strings.push(obj[prop]);
                }
            }
            return strings;
        };

        var getProperties = function(obj, properties) {
            var strings = [];
            for (var i=0, len=properties.length; i<len; i++) {
                strings.push(obj[properties[i]]);
            }
            return strings;
        };

        return function(haystack, needle, properties) {

            var results = [];

            if(!needle) {
                return haystack;
            }

            for(var i=0; i<haystack.length; i++) {

                var testObj = haystack[i],
                    searchStrings = [];

                if(angular.isArray(properties)) {
                    searchStrings = getProperties(testObj, properties);
                }
                else {
                    searchStrings = getAllStringProperties(testObj);
                }

                for (var j=0; j<searchStrings.length; j++) {
                    if(searchStrings[j] && String(searchStrings[j]).toLowerCase().indexOf(needle.toLowerCase()) !== -1) {
                        results.push(testObj);
                        break;
                    }
                }
            }

            return results;
        };
    }])
    .filter('wordDeclension', [function () {
        return function(iNum, aEndings) {
            var sEnding, i, iNumber;
            if(typeof iNum != 'number') iNum = 0;
            iNumber = iNum % 100;
            if (iNumber>=11 && iNumber<=19) {
                sEnding=aEndings[2];
            }
            else {
                i = iNumber % 10;
                switch (i)
                {
                    case (1): sEnding = aEndings[0]; break;
                    case (2):
                    case (3):
                    case (4): sEnding = aEndings[1]; break;
                    default: sEnding = aEndings[2];
                }
            }
            return iNum + ' ' + sEnding;
        };
    }])
    .filter('parent', function () {
        return function (data, n) {
            var parent = data;
            for(var i=0; i<n; i++) {
                parent = parent.$parent;
                if(!parent) {
                    break;
                }
            }
            return parent;
        };
    })
    .filter('idx', function ($rootScope) {
        return function (data, idx) {
            var result = [];
            idx = idx.split('.');
            if($rootScope[idx[0]] && $rootScope[idx[0]].length) {
                if(!angular.isArray(data)) {
                    if ($rootScope[idx[0]].idx[idx[1]]) {
                        result = $rootScope[idx[0]].idx[idx[1]][data];
                    }
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        if ($rootScope[idx[0]].idx[idx[1]]) {
                            result.push($rootScope[idx[0]].idx[idx[1]][data[i]]);
                        }
                    }
                }

            }
            return result;
        };
    });
