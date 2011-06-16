/**
 * collision.js description here
 *
 * @author fridek
 * @date 12.06.11
 * @version $
 */

(function () {

    var col;

    var Collision = function (obj1, obj2, collisionNormal, restitution, penetration, failsafe) {
            if(settings.log) console.log('collision', obj1, obj2, penetration, collisionNormal);

            /*
            * very rare - when a posteriori collision moves sphere right into another causing undetected collision
            * nextPosition is equal to position and prevPosition then, so we can't step back
            * applying punishment is fast way to deal with such errors
             */
            if(!failsafe) {
                var punish = M.multiVec(collisionNormal, penetration);
                obj1.setMovement(M.addVec(obj1.nextSpeed, punish));
                obj2.setMovement(M.subVec(obj2.nextSpeed, punish));
                return;
            }

            collisionNormal = M.vecNormalise(collisionNormal);

            obj1.stepBack(collisionNormal, penetration, -1);
            obj2.stepBack(collisionNormal, penetration, 1);

            if(M.vec1Length(collisionNormal) == 0) {
                console.log('collision normal = 0, panic!');
                return false;
            }

            // collision reaction model (mass ignored)
            var relativeVelocity = M.subVec(obj1.nextSpeed, obj2.nextSpeed),
                Vrn = M.multiVecVec(collisionNormal, relativeVelocity);

            var j = (-(1+restitution) * Vrn),
                deltaV = M.multiVec(collisionNormal,j);

            obj1.setMovement(M.addVec(obj1.nextSpeed, deltaV));
            obj2.setMovement(M.subVec(obj2.nextSpeed, deltaV));
    };

    // for spheres
    window.detectCollision = function (obj1, obj2) {
        /*
        * failsafe
        * very rare - when a posteriori collision moves sphere right into another causing undetected collision
         */
        var collisionNormal = M.subVec(obj1.position, obj2.position),
            dist = M.vec1Length(collisionNormal), restitution = 0,
            radiusSum = obj1.boundingSphereRadius + obj2.boundingSphereRadius;

        if(dist <= radiusSum) {
            col = new Collision(obj1, obj2, collisionNormal, restitution, dist - radiusSum, false);
            // for further processing
            return col;
        }

        // a posteriori
        collisionNormal = M.subVec(obj1.nextPosition, obj2.nextPosition);
        dist = M.vec1Length(collisionNormal);
        restitution = 0;
        radiusSum = obj1.boundingSphereRadius + obj2.boundingSphereRadius;

        if(dist <= radiusSum) {
            col = new Collision(obj1, obj2, collisionNormal, restitution, dist - radiusSum, true);
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

        col = new Collision(sphere, box, collisionNormal, restitution, dist, true);
        // for further processing
        return col;
    }
}());