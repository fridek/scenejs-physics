/**
 * utils.js description here
 *
 * @author fridek
 * @date 12.06.11
 * @version $
 */


/**
 * Generating x*y*z spheres, formed into cube with center in (0,0,0)
 *
 * @param x number of spheres on x axis
 * @param y number of spheres on y axis
 * @param z number of spheres on z axis
 * @param distance between spheres
 * @param random_movements apply random movement speeds - Math.random()-0.5 on each axis
 */
function generateSpheresCube(x,y,z,distance,random_movements) {
    var i, j, k, cnt = 0,
        i_start = -1*x*0.5 * distance,
        i_end = x*0.5 * distance,
        j_start = -1*y*0.5 * distance,
        j_end = y*0.5 * distance,
        k_start = -1*z*0.5 * distance,
        k_end = z*0.5 * distance,
        objects = [];

    for(i = i_start; i <= i_end; i+=distance) {
        for(j = j_start; j <= j_end; j+=distance) {
            for(k = k_start; k <= k_end; k+=distance) {
            objects[cnt] = makeObject('sphere', [i,j,k], [0.5,0.5,0.5], null, "box" + cnt);
            if(random_movements) {
                objects[cnt].setMovement([0.0,0.0,0.0], [Math.random()-0.5,Math.random()-0.5,Math.random()-0.5]);
            }
            else {
                objects[cnt].setMovement([0.0,0.0,0.0], [0.0,0.0,0.0]);
            }
            cnt+=1;
            }
        }
    }

    return objects;
}