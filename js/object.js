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

    // console.log('create object: ', type, position, scale, id);

    return {
        transform: function (p, s) {
            if(p) {
                SceneJS.withNode(id + '-translate').set({ x: p[0], y: p[1], z: p[2] })
            }
            if(s) {
                SceneJS.withNode(id + '-scale').set({ x: s[0], y: s[1], z: s[2] })
            }
        },

        setMovement: function (s, a) {
            if(s) this.speed = s;
            if(a) this.acceleration = M.addVec(a, settings.gravity);
        },

        setPosition: function (p) {
            this.position = p;
        },

        calculateNextPosition: function (time) {
            this.speed = M.addVec(this.speed,M.multiVec(this.acceleration,time));
            this.nextPosition = M.addVec(this.position,M.multiVec(this.speed,time));

            if(this.nextPosition[1] < (settings.floorLevel + this.boundingSphereRadius)) {
                this.acceleration[1] = settings.gravity[1];
                this.speed[1] *= -1 * settings.floorBounce;
                this.nextPosition[1] = settings.floorLevel + this.boundingSphereRadius;
            }
        },

        updatePosition: function () {
            this.transform(this.nextPosition);
            this.prevPosition = this.position;
            this.position = this.nextPosition;
        },

        prevPosition: [0.0,0.0,0.0],
        position: position,
        nextPosition: [0.0,0.0,0.0],

        scale: scale,

        speed: [0.0,0.0,0.0],
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
