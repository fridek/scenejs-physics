/**
 * collision.js description here
 *
 * @author fridek
 * @date 12.06.11
 * @version $
 */

// for spheres
var detectCollision = function (obj1, obj2) {
    var dist = M.vecLength([obj1.nextPosition, obj2.nextPosition]),
        collisionNormal, relativeVelocity, Vrn, fCr = 0, j,
        radiusSum = obj1.boundingSphereRadius + obj2.boundingSphereRadius;


    if(dist <= radiusSum) {

        collisionNormal = M.multiVec(M.subVec(obj1.nextPosition, obj2.nextPosition),1.0/dist); // normalization
        relativeVelocity = M.subVec(obj1.speed, obj2.speed);
        Vrn = M.multiVecVec(collisionNormal, relativeVelocity);

        j = (-(1+fCr) * Vrn) / ( M.multiVecVec(collisionNormal, collisionNormal) ); // * (1/obj1.mass + 1/obj2.mass));

        // collision code
        obj1.setMovement(M.addVec(obj1.speed, M.multiVec(collisionNormal,j)));
        obj2.setMovement(M.subVec(obj1.speed, M.multiVec(collisionNormal,j)));
    }
};