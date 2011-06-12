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


function detectCollisionBoxSphere(box, sphere) {
    // Transform the centre of the sphere into box coordinates
// ignorujemy, box bedzie nie obrocony
//    Vector3 centre = sphere.getAxis(3);
//    Vector3 relCentre = box.transform.transformInverse(centre);

    var centre = sphere.position,
        relCentre = M.subVec(sphere.position,box.position),
        box_halfSize = box.scale;
    
    
    // Early out check to see if we can exclude the contact
    if (Math.abs(relCentre[0]) - sphere.boundingSphereRadius > box_halfSize[0] ||
        Math.abs(relCentre[1]) - sphere.boundingSphereRadius > box_halfSize[1] ||
        Math.abs(relCentre[2]) - sphere.boundingSphereRadius > box_halfSize[2])
    {
        return false;
    }

    var closestPt = [0,0,0], dist;

    // Clamp each coordinate to the box.
    dist = relCentre[0];
    if (dist > box_halfSize[0]) dist = box_halfSize[0];
    if (dist < -box_halfSize[0]) dist = -box_halfSize[0];
    closestPt[0] = dist;

    dist = relCentre[1];
    if (dist > box_halfSize[1]) dist = box_halfSize[1];
    if (dist < -box_halfSize[1]) dist = -box_halfSize[1];
    closestPt[1] = dist;

    dist = relCentre[2];
    if (dist > box_halfSize[2]) dist = box_halfSize[2];
    if (dist < -box_halfSize[2]) dist = -box_halfSize[2];
    closestPt[2] = dist;

    // Check we're in contact
    dist = M.vecLength(M.subVec(closestPt, relCentre));
    if (dist > sphere.radius * sphere.radius) return false;
/*
    // Compile the contact
    Vector3 closestPtWorld = box.transform.transform(closestPt);

    Contact* contact = data->contacts;
    contact->contactNormal = (closestPtWorld - centre);
    contact->contactNormal.normalise();
    contact->contactPoint = closestPtWorld;
    contact->penetration = sphere.radius - Math.sqrt(dist);
    contact->setBodyData(box.body, sphere.body, data->friction, data->restitution);

    data->addContacts(1);
*/
    return true;
}