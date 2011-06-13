/**
 * math.js description here
 *
 * @author fridek
 * @date 12.06.11
 * @version $
 */

var M = {
    multiVec: function (v, f) {
        var tmp = [], i;
        for(i=0;i<v.length;i+=1) {
            tmp[i] = v[i] * f;
        }
        return tmp;
    },

    multiVecVec: function (v1, v2) {
        if(v1.length != v2.length) throw "Error in multiVecVec: invalid vectors dimensions";
        var tmp = 0, i;
        for(i=0;i<v1.length;i+=1) {
            tmp += v1[i] * v2[i];
        }
        return tmp;
    },

    addVec: function (v1, v2) {
        if(v1.length != v2.length) throw "Error in addVec: invalid vectors dimensions";

        var tmp = [], i;
        for(i=0;i<v1.length;i+=1) {
            tmp[i] = v1[i] + v2[i];
        }
        return tmp;
    },

    subVec: function (v1, v2) {
        if(v1.length != v2.length) throw "Error in subVec: invalid vectors dimensions";

        var tmp = [], i;
        for(i=0;i<v1.length;i+=1) {
            tmp[i] = v1[i] - v2[i];
        }
        return tmp;
    },

    vecLength: function(v) {
        if(v[0].length != v[1].length) throw "Error in vecLength: invalid vectors dimensions";

        var len = 0, i, t;
        for(i = 0; i<v[0].length; i+= 1) {
            t = v[0][i] - v[1][i];
            len += t*t;
        }
        return Math.sqrt(len);
    },

    vec1Length: function (v) {
        var length = 0;
        for(var i=0;i<v.length;i+=1) length+=v[i]*v[i];
        return Math.sqrt(length);
    },

    vecNormalise: function(v) {
        var length = M.vec1Length(v);
        if(length == 0) return v;
        return M.multiVec(v, 1/length);
    }
};