/**
 * Main loading file
 */

var settings = {
    gravity: [0.0,-1.0,0.0],
    floorLevel: -15,
    floorRestitution: 0.5,
    frameTime: 0,
    simulationTime: 1000/30,

    log: false,

    watchedSphere: 2 + 5* 0 + 5*5 * 2
};

$(window).ready(function() {
    window.objects = generateSpheresCube(5,5,5,2,true);
    initScene(settings);

    for(var i = 0; i < objects.length; i+=1) {
        SceneJS.createNode(objects[i]);
    }

    var box = makeObject('box', [0.0,-7.0,0.0], [5.0,1.0,3.0], 5.0, 'box');
    SceneJS.createNode(box);

    SceneJS.withNode(objects[settings.watchedSphere].id)
                        .insert("node", {
                            type: "material",
                            emit: 0,
                            baseColor:      { r: 0.3, g: 0.9, b: 0.3 },
                            specularColor:  { r: 0.3, g: 0.9, b: 0.3 },
                            specular:       0.7,
                            shine:          10.0
                        });

    var log = $('#log');
    var run = false;

    /**
     * Every render loop consists of:
     * - calculating new position based on acceleration, speed and prev. position
     * - detection of sphere-sphere collisions
     * - detection of sphere-big box collision
     * - position update based on step 1 & adjustments forced by collisions
     */
     var renderLoop =  function () {

            for(i=0;i < objects.length; i+=1) {
                objects[i].calculateNextPosition(1.0 * settings.simulationTime / 1000.0);
                
                for(var j=i+1;j < objects.length; j+=1) {
                    detectCollision(objects[i], objects[j]);
                }

                if(detectCollisionBoxSphere(box, objects[i])) {
                    // if sphere collided with bog box, paint it red
                    if(!objects[i].red) {
                        SceneJS.withNode(objects[i].id)
                        .insert("node", {
                            type: "material",
                            emit: 0,
                            baseColor:      { r: 0.9, g: 0.3, b: 0.3 },
                            specularColor:  { r: 0.9, g: 0.3, b: 0.3 },
                            specular:       0.7,
                            shine:          10.0
                        });
                        objects[i].red = true; // avoid multiple material definition
                    }
                }

                objects[i].updatePosition();
            }

        log.html('x: ' + objects[settings.watchedSphere].position[0] +
                 'y: ' + objects[settings.watchedSphere].position[1] +
                 'z: ' + objects[settings.watchedSphere].position[2]);

        if(run) window.setTimeout(renderLoop, settings.frameTime);
    };

    $('#camera_perspective').click(function () {
        SceneJS.withNode('camera').set({ eye : { x: 0.0, y: 10.0, z: 15 } });
    });
    $('#camera_top').click(function () {
        SceneJS.withNode('camera').set({ eye : { x: 0.0, y: 50.0, z: 1.0 } });
    });
    $('#camera_left').click(function () {
        SceneJS.withNode('camera').set({ eye : { x: 70.0, y: 1.0, z: 0.0 } });
    });

    $('#run').click(function () {
        if(run) {
            run = false;
        } else {
            run = true;
            renderLoop();
        }
    });

    $('#log_button').click(function () {
        settings.log = !settings.log;
    });
});

