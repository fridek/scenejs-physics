/**
 * collision.js description here
 *
 * @author fridek
 * @date 12.06.11
 * @version $
 */

(function () {

    var col;

    var Collision = function (obj1, obj2, collisionNormal, restitution) {

            collisionNormal = M.vecNormalise(collisionNormal);

            if(M.vec1Length(collisionNormal) == 0) return false;

            // collision reaction model (mass ignored)
            var relativeVelocity = M.subVec(obj1.nextSpeed, obj2.nextSpeed),
                Vrn = M.multiVecVec(collisionNormal, relativeVelocity);

            var j = (-(1+restitution) * Vrn); // M.multiVecVec(collisionNormal, collisionNormal);

            obj1.setMovement(M.addVec(obj1.nextSpeed, M.multiVec(collisionNormal,j)));
            obj2.setMovement(M.subVec(obj1.nextSpeed, M.multiVec(collisionNormal,j)));

            obj1.stepBack();
            obj2.stepBack();
        

    };

    // for spheres
    window.detectCollision = function (obj1, obj2) {
        var dist = M.vecLength([obj1.nextPosition, obj2.nextPosition]),
            collisionNormal, restitution = 0,
            radiusSum = obj1.boundingSphereRadius + obj2.boundingSphereRadius;

        if(dist <= radiusSum) {
            // collision (ignoring mass)
            collisionNormal = M.subVec(obj1.nextPosition, obj2.nextPosition);

            col = new Collision(obj1, obj2, collisionNormal, restitution);
            // for further processing
            return col;
        }
        return false;
    };

    // AABB + sphere
    window.detectCollisionBoxSphere = function (box, sphere) {

        var centre = sphere.position,
            // sphere centre relative to box centre
            relCentre = M.subVec(sphere.position,box.position),
            // box size
            box_size = box.scale,

            collisionNormal, penetration, Vrn, restitution = 1, closestPtWorld, j, i;

        // simple check if sphere is too far to possibly have any contact (SAT)
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

        collisionNormal = M.subVec(centre, closestPtWorld);

        col = new Collision(sphere, box, collisionNormal, restitution);
        // for further processing
        return col;
    }
}());