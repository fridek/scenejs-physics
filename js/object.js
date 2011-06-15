/**
 * object.js description here
 *
 * @author fridek
 * @date 12.06.11
 * @version $
 */
/**
 * Object creator
 *
 * @param type
 * @param position vector [x,y,z] , default [0.0,0.0,0.0]
 * @param scale vector [x,y,z] , default [1.0,1.0,1.0]
 * @param boundingSphereRadius value, default scale[0]
 * @param id must be unique!
 */
var makeObject = function (type, position, scale, boundingSphereRadius, id) {
    if(!position)   position = [0.0,0.0,0.0];
    if(!scale)      scale = [1.0,1.0,1.0];
    if(!boundingSphereRadius) boundingSphereRadius = scale[0];

    return {
        objectType: type,

        transform: function (p, s) {
            if(p) {
                SceneJS.withNode(id + '-translate').set({ x: p[0], y: p[1], z: p[2] })
            }
            if(s) {
                SceneJS.withNode(id + '-scale').set({ x: s[0], y: s[1], z: s[2] })
            }
        },

        setMovement: function (s, a) {
            if(this.objectType != "sphere") return; // not suppoerted yet

            if(s) {
                this.speed = s;
                this.nextSpeed = s;
            }
            if(a) {
                console.log('before', this.acceleration);
                this.acceleration = M.addVec(a, settings.gravity);
                console.log('after', this.acceleration);
            }
        },

        setPosition: function (p) {
            if(this.objectType != "sphere") return; // not suppoerted yet

            this.position = p;
        },

        _calculateNextPositionMethod: movement.euler_modified,

        calculateNextPosition: function (time) {
            this._calculateNextPositionMethod.apply(this, [time]);

            /**
             * forbidden area
             * to be removed later
             */
            if(this.nextPosition[1] < (settings.floorLevel + this.boundingSphereRadius)) {
                this.acceleration[1] = settings.gravity[1];
                this.nextSpeed[1] *= -1 * settings.floorRestitution;
                this.nextPosition[1] = settings.floorLevel + this.boundingSphereRadius;
            }
        },

        updatePosition: function () {
            if(this.objectType != "sphere") return; // not supported yet

            this.transform(this.nextPosition);

            this.prevPosition = this.position;
            this.position = this.nextPosition;

            this.speed = this.nextSpeed;
        },

        stepBack: function (collisionNormal, penetration, direction) {
            if(this.objectType != "sphere") return; // not supported yet

            /*
            * each object should be moved by penetration*direction/2 to be back in point where collision occured
            * second penetration*direction/2 is approximation of path it could move after collision
            * correct aproach would be to calculate time of penetration, contract by penetration*direction/2 and
            * calculate new movement with new speed and calculated time
             */

//            var correction = M.multiVec(collisionNormal, penetration*direction/2),
//                wrongMove = M.subVec(this.nextPosition, this.position),
//                newMove = M.subVec(wrongMove, correction);
//
//            if(settings.log) {
//                console.log(this.position, this.nextPosition);
//                console.log(collisionNormal, penetration, direction, correction);
//            }
//
//            this.nextPosition = M.addVec(this.prevPosition, newMove);
//            this.nextPosition = M.addVec(this.position, newMove);
            //this.position = M.addVec(this.prevPosition, newMove);

            this.nextPosition = this.prevPosition;
            this.position = this.prevPosition;
        },

        prevPosition: [0.0,0.0,0.0],
        position: position,
        nextPosition: [0.0,0.0,0.0],

        scale: scale,

        speed: [0.0,0.0,0.0],
        nextSpeed: [0.0,0.0,0.0],
        acceleration: settings.gravity,

        boundingSphereRadius: boundingSphereRadius,

        type: "translate",
        // Example translation
        x:  position[0],
        y:  position[1],
        z:  position[2],

        id: id + '-translate',
        parent: "objects-parent",

        nodes : [
            {
                type: "scale",
                x:  scale[0],
                y:  scale[1],
                z:  scale[2],

                id: id + '-scale',

                nodes: [
                    {
                        type : type
                    }
                ]
            }
        ]
    }

};
