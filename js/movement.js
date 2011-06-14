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
    }
};
