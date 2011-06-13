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

        j = (-(1+fCr) * Vrn) / M.multiVecVec(collisionNormal, collisionNormal); // * (1/obj1.mass + 1/obj2.mass));

        // collision code
        obj1.setMovement(M.addVec(obj1.speed, M.multiVec(collisionNormal,j)));
        obj2.setMovement(M.subVec(obj1.speed, M.multiVec(collisionNormal,j)));
    }
};

// AABB + sphere
function detectCollisionBoxSphere(box, sphere) {

    var centre = sphere.position,
        // sphere centre relative to box centre
        relCentre = M.subVec(sphere.position,box.position),
        // box size
       // box_size = M.multiVec(box.scale,0.5),
        box_size = box.scale,

        collisionNormal, penetration, Vrn, restitution = 1, closestPtWorld, j, i;

    // simple check if sphere is too far to possibly have any contact
    if (Math.abs(relCentre[0]) - sphere.boundingSphereRadius > box_size[0] ||
        Math.abs(relCentre[1]) - sphere.boundingSphereRadius > box_size[1] ||
        Math.abs(relCentre[2]) - sphere.boundingSphereRadius > box_size[2] ) {
        return false;
    }

    // SAT may fail near box vertex
    var closestPt = [0,0,0], dist;

    // find point closest to box center
    // Arvo's algorithm
    for(i = 0; i<=2; i+=1) {
        dist = relCentre[i];
        if (dist > box_size[i]) dist = box_size[i];
        if (dist < -box_size[i]) dist = -box_size[i];
        closestPt[i] = dist;
    }

    // Check we're in contact
    dist = M.vec1Length(M.subVec(closestPt, relCentre));
    penetration = sphere.boundingSphereRadius - dist;
    if (penetration < 0) return false;

    closestPtWorld = M.addVec(closestPt,box.position);

    collisionNormal = M.subVec(closestPtWorld, centre);
    collisionNormal = M.vecNormalise(collisionNormal);

/*
    Vrn = [];
    for(i=0;i<collisionNormal.length;i+=1) Vrn[i] = collisionNormal[i] * sphere.speed[i];

//    i = M.multiVecVec(collisionNormal, collisionNormal);
//    if(i != 0) {

    j = M.multiVec(Vrn,-(1+restitution));

//    } else {
//        j = 0;
//    }
    console.log('collision', Date.now(),
            'col normal', collisionNormal,
            'penetration', penetration,
            'Vrn', Vrn,
            'j', j,
            'sphere speed', sphere.speed
    );
//    console.log(sphere.speed, M.multiVec(collisionNormal,j));

    sphere.setMovement(M.subVec(sphere.speed, j));
*/
    return true;
}