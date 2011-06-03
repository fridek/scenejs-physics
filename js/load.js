$(window).ready(function() {

    var settings = {
        gravity: [0.0,-1.0,0.0],
        floorLevel: -10,
        floorBounce: 0.5
    };

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
        }
    };

    var makeObject = function (type, position, scale, boundingSphereRadius, id) {
        if(!position)   position = [0.0,0.0,0.0];
        if(!scale)      scale = [1.0,1.0,1.0];
        if(!boundingSphereRadius) boundingSphereRadius = scale[0];


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

            speed: [0.0,0.0,0.0],
            acceleration: settings.gravity,

            boundingSphereRadius: boundingSphereRadius,

            type: "translate",
            // Example translation
            x:  position[0],
            y:  position[1],
            z:  position[2],

            id: id + '-translate',

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
/*
    // global on purpose
    objects = [
            makeObject('sphere', [0.5,0.0,0.0], [0.5,0.5,0.5], null, "box1"),
            makeObject('sphere', [0.0,2.0,0.5], [0.5,0.5,0.5], null, "box2"),
            makeObject('sphere', [0.5,4.0,0.0], [0.5,0.5,0.5], null, "box3"),
            makeObject('sphere', [0.5,3.0,2.0], [0.5,0.5,0.5], null, "box4"),
            makeObject('sphere', [0.0,3.0,1.0], [0.5,0.5,0.5], null, "box5")
        ];

    
    objects[1].setMovement([0.0,0.0,0.0], [0.0,-1.0,0.0]);
    objects[2].setMovement([0.0,0.0,0.0], [0.0,-2.0,0.0]);
*/
    objects = [];
    var randomRange = 5;
    for(i = 0; i < 10; i+=1) {
        objects[i] = makeObject('sphere', [(Math.random()-0.5)*randomRange,(Math.random()-0.5)*randomRange,(Math.random()-0.5)*randomRange], [0.5,0.5,0.5], null, "box" + i);
        objects[i].setMovement([0.0,0.0,0.0], [Math.random()-0.5,Math.random()-0.5,Math.random()-0.5]);
    }

    initScene(objects, settings);

    // for spheres
    var detectCollision = function (box1, box2) {
        var dist = M.vecLength([box1.nextPosition, box2.nextPosition]),
            collisionNormal, relativeVelocity, Vrn, fCr = 0, j,
            radiusSum = box1.boundingSphereRadius + box2.boundingSphereRadius;


        if(dist <= radiusSum) {

            collisionNormal = M.multiVec(M.subVec(box1.nextPosition, box2.nextPosition),1.0/dist); // normalization
            relativeVelocity = M.subVec(box1.speed, box2.speed);
            Vrn = M.multiVecVec(collisionNormal, relativeVelocity);

//            console.log("collision of", box1.id, "and", box2.id, collisionNormal, relativeVelocity, Vrn);

            j = (-(1+fCr) * Vrn) / ( M.multiVecVec(collisionNormal, collisionNormal) ); // * (1/box1.mass + 1/box2.mass));

            // collision code
            box1.setMovement(M.addVec(box1.speed, M.multiVec(collisionNormal,j)));
            box2.setMovement(M.subVec(box1.speed, M.multiVec(collisionNormal,j)));
        }
    };

    var frameTime = 1000/30,
        time = Date.now(),
        prevTime,
        i, j,
        renderLoop =  function () {
            prevTime = time;
            time = Date.now();

            for(i=0;i < objects.length; i+=1) {
                objects[i].calculateNextPosition(1.0 * (time-prevTime) / 1000.0);
                for(j=i+1;j < objects.length; j+=1) {
                    detectCollision(objects[i], objects[j]);
                }
                objects[i].updatePosition();
            }

        window.setTimeout(renderLoop, frameTime);
    };
    renderLoop();
});

