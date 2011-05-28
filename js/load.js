$(window).ready(function() {

    var M = {
        multiVec: function (v, f) {
            var tmp = [], i;
            for(i=0;i<v.length;i+=1) {
                tmp[i] = v[i] * f;
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
        }
    };

    var makeBox = function (position, scale, id) {
        if(!position)   position = [0.0,0.0,0.0];
        if(!scale)      scale = [1.0,1.0,1.0];

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
                if(a) this.acceleration = a;
            },

            calculateNextPosition: function (time) {
                this.speed = M.addVec(this.speed,M.multiVec(this.acceleration,time));
                this.nextPosition = M.addVec(this.position,M.multiVec(this.speed,time));
            },

            updatePosition: function () {
                this.transform(this.nextPosition);
                this.prevPosition = this.position;
                this.position = this.nextPosition;
            },

            prevPosition: [0.0,0.0,0.0],
            position: [0.0,0.0,0.0],
            nextPosition: [0.0,0.0,0.0],

            speed: [0.0,0.0,0.0],
            acceleration: [0.0,0.0,0.0],

            type: "translate",
            // Example translation
            x:  position[0],
            y:  position[1],
            z:  position[2],

            id: id + '-translate',

            nodes : [
                {
                    type: "scale",
                    // Example scaling
                    x:  scale[0],
                    y:  scale[1],
                    z:  scale[2],

                    id: id + '-scale',

                    nodes: [
                        {
                            type : "box"
                        }
                    ]
                }
            ]
        }

    };

    // global on purpose
    boxes = [
        makeBox([0.0,0.0,0.0], [1.0,1.0,1.0], "box1")
        ];

    SceneJS.setDebugConfigs({
        webgl: {
            logTrace: true
        }
    });

    SceneJS.createNode({

        type: "scene",

        /* ID that we'll access the scene by when we want to render it
         */
        id: "theScene",

        /* Bind scene to a WebGL canvas:
         */
        canvasId: "theCanvas",

        /* You can optionally write logging to a DIV - scene will log to the console as well.
         */
        loggingElementId: "theLoggingDiv",

        nodes: [

            /* Viewing transform specifies eye position, looking
             * at the origin by default
             */
            {
                type: "lookAt",
                eye : { x: 0.0, y: 10.0, z: 15 },
                look : { y:1.0 },
                up : { y: 1.0 },

                nodes: [

                    /* Camera describes the projection
                     */
                    {
                        type: "camera",
                        optics: {
                            type: "perspective",
                            fovy : 25.0,
                            aspect : 1.47,
                            near : 0.10,
                            far : 300.0
                        },

                        nodes: [


                            /* A lights node inserts point lights into scene, to illuminate everything
                             * that is encountered after them during scene traversal.
                             *
                             * You can have many of these, nested within modelling transforms if you want to move them.
                             */
                            {
                                type: "light",
                                mode:                   "dir",
                                color:                  { r: 1.0, g: 1.0, b: 1.0 },
                                diffuse:                true,
                                specular:               true,
                                dir:                    { x: 1.0, y: -0.5, z: -1.0 }
                            },

                            {
                                type: "light",
                                mode:                   "dir",
                                color:                  { r: 1.0, g: 1.0, b: 0.8 },
                                diffuse:                true,
                                specular:               false,
                                dir:                    { x: 0.0, y: -0.5, z: -1.0 }
                            },

                            /* Next, modelling transforms to orient our teapot. See how these have IDs,
                             * so we can access them to set their angle attributes.
                             */
                            {
                                type: "rotate",
                                id: "pitch",
                                angle: 0.0,
                                x : 1.0,

                                nodes: [
                                    {
                                        type: "rotate",
                                        id: "yaw",
                                        angle: 0.0,
                                        y : 1.0,

                                        nodes: [

                                            /* Specify the amounts of ambient, diffuse and specular
                                             * lights our teapot reflects
                                             */
                                            {
                                                type: "material",
                                                emit: 0,
                                                baseColor:      { r: 0.3, g: 0.3, b: 0.9 },
                                                specularColor:  { r: 0.9, g: 0.9, b: 0.9 },
                                                specular:       0.7,
                                                shine:          10.0,



                                                nodes: boxes
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    /*----------------------------------------------------------------------
     * Scene rendering loop and mouse handler stuff follows
     *---------------------------------------------------------------------*/
    var yaw = 0;
    var pitch = 0;
    var lastX;
    var lastY;
    var dragging = false;


    SceneJS.withNode("theScene").render();

    var canvas = document.getElementById("theCanvas");

    function mouseDown(event) {
        lastX = event.clientX;
        lastY = event.clientY;
        dragging = true;
    }

    function mouseUp() {
        dragging = false;
    }

    /* On a mouse drag, we'll re-render the scene, passing in
     * incremented angles in each time.
     */
    function mouseMove(event) {
        if (dragging) {
            yaw += (event.clientX - lastX) * 0.5;
            pitch += (event.clientY - lastY) * 0.5;

            SceneJS.withNode("yaw").set("angle", yaw);
            SceneJS.withNode("pitch").set("angle", pitch);

            lastX = event.clientX;
            lastY = event.clientY;
        }
    }

    canvas.addEventListener('mousedown', mouseDown, true);
    canvas.addEventListener('mousemove', mouseMove, true);
    canvas.addEventListener('mouseup', mouseUp, true);


    SceneJS.withNode("theScene").start();

    (function () {
        boxes[0].setMovement([0.0,1.0,0.0]);

        var frameTime = 1000/30,
            time = Date.now(),
            prevTime,
            i,
            renderLoop =  function () {
                prevTime = time;
                time = Date.now();

                for(i=0;i < boxes.length; i+=1) {
                    boxes[i].calculateNextPosition(1.0 * (time-prevTime) / 1000.0);
                    boxes[i].updatePosition();
                }

            window.setTimeout(renderLoop, frameTime);
        };
        renderLoop();
    }());
});

