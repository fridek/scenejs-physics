/**
 * Various movement methods used by objects in calculateNextPosition
 *
 * @author fridek
 * @date 14.06.11
 * @version $
 */

var movement = {
    euler: function (time) {
        this.nextSpeed = M.addVec(this.speed,M.multiVec(this.acceleration,time)); // speed + acc*time
        this.nextPosition = M.addVec(this.position,M.multiVec(this.speed,time)); // pos + speed*time
    },

    euler_modified: function(time) {
        this.nextSpeed = M.addVec(this.speed,M.multiVec(this.acceleration,time)); // speed + acc*time
        this.nextPosition = M.addVec(this.position,M.multiVec(this.nextSpeed,time));  // pos + nextSpeed*time
    },


    _rk_eval: function (delta_time, prev_k) {
       return {
           position: M.addVec(prev_k.position,M.multiVec(this.speed,delta_time)),
           speed: M.addVec(prev_k.speed,M.multiVec(this.acceleration,delta_time))
       }
    },

    /**
     *
     * @param k
     * @param wages
     * @param key
     */
    _rk_avg: function (k, wages, key) {
        var result = [0,0,0], sum = 0;

        for(var i = 0; i < k.length; i+=1) {
            (function(i) {
                sum += wages[i];
                result = M.addVec(result, M.multiVec(k[i][key], wages[i]));
            }(i));
        }

        return M.multiVec(result, 1/sum);
    },

    // rk2 improved
    heun: function (time) {
        var k = [{position: [0,0,0], speed: [0,0,0]},{position: [0,0,0], speed: [0,0,0]}], //k0, k1
            dt = [0,0,time*0.5];

        k[2] = movement._rk_eval.apply(this, [dt[2], k[1]]);

        var dxdt = movement._rk_avg(k, [0,1,1], 'position');
        var dvdt = movement._rk_avg(k, [0,1,1], 'speed');

        this.nextPosition = M.addVec(this.position, dxdt);
        this.nextSpeed = M.addVec(this.speed, dvdt);
    },

    rk4: function (time) {
        var k = [{position: [0,0,0], speed: [0,0,0]},{position: [0,0,0], speed: [0,0,0]}], //k0, k1
            dt = [0,0,time*0.5,time*0.5,time];

        for(var i = 1; i <= 3; i += 1) {
            k[i+1] = movement._rk_eval.apply(this, [dt[i], k[i]]);
        }

        var dxdt = movement._rk_avg(k, [0,1,2,2,1], 'position');
        var dvdt = movement._rk_avg(k, [0,1,2,2,1], 'speed');

        this.nextPosition = M.addVec(this.position, dxdt);
        this.nextSpeed = M.addVec(this.speed, dvdt);
    }
};
