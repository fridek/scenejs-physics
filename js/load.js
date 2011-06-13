var settings = {
    gravity: [0.0,-1.0,0.0],
    floorLevel: -15,
    floorBounce: 0.5
};

$(window).ready(function() {
    var objects = generateSpheresCube(5,5,5,2,true);
    initScene(settings);

    for(var i = 0; i < objects.length; i+=1) {
        SceneJS.createNode(objects[i]);
    }

    var box = makeObject('box', [0.0,-7.0,0.0], [5.0,1.0,3.0], 5.0, 'box');
    SceneJS.createNode(box);

    SceneJS.withNode(objects[0].id)
                        .insert("node", {
                            type: "material",
                            emit: 0,
                            baseColor:      { r: 0.3, g: 0.9, b: 0.3 },
                            specularColor:  { r: 0.3, g: 0.9, b: 0.3 },
                            specular:       0.7,
                            shine:          10.0
                        });

    var log = $('#log');
    var run = true;

    var frameTime = 1000/30,
//        time = Date.now(),
//        prevTime,
        renderLoop =  function () {
//            prevTime = time;
//            time = Date.now();

            for(i=0;i < objects.length; i+=1) {
//                objects[i].calculateNextPosition(1.0 * (time-prevTime) / 1000.0);
                objects[i].calculateNextPosition(1.0 * (frameTime) / 1000.0);
                for(j=i+1;j < objects.length; j+=1) {
                    detectCollision(objects[i], objects[j]);
                }
                if(detectCollisionBoxSphere(box, objects[i])) {
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

        log.html('x: ' + objects[0].position[0] + 'y: ' + objects[0].position[1] + 'z: ' + objects[0].position[2]);

        if(run) window.setTimeout(renderLoop, frameTime);
    };
    renderLoop();

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
});

