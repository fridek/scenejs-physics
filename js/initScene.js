/**
 * initScene.js description here
 *
 * @author fridek
 * @date 03.06.11
 * @version $
 */

//    SceneJS.setDebugConfigs({
//        webgl: {
//            logTrace: true
//        }
//    });

function initScene(objects, settings) {

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

                                            {
                                                type: "material",
                                                emit: 0,
                                                baseColor:      { r: 0.3, g: 0.3, b: 0.3 },
                                                specularColor:  { r: 0.3, g: 0.3, b: 0.3 },
                                                specular:       0.7,
                                                shine:          10.0,

                                                nodes: [
                                                    {
                                                    type: "translate",

                                                    // Example translation
                                                    x:  0.0,
                                                    y:  settings.floorLevel - 1,
                                                    z:  0.0,

                                                    nodes : [
                                                        {
                                                            type: "scale",
                                                            x:  1000,
                                                            y:  1.0,
                                                            z:  1000,

                                                            nodes: [
                                                                {
                                                                    type : 'box'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                    }
                                                ]
                                            },


                                            {
                                                type: "material",
                                                emit: 0,
                                                baseColor:      { r: 0.3, g: 0.3, b: 0.9 },
                                                specularColor:  { r: 0.9, g: 0.9, b: 0.9 },
                                                specular:       0.7,
                                                shine:          10.0,

                                                nodes: objects
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
    
};