# object-streamer

Object streamer for alt:V Multiplayer (Typescript)



A simple and useful object handler (with sync attachable to entity). It is based on server side usage.



**Note:** Techincal support will not be provided. It is not recommended to use if you dont have sufficient technical knowledge. (but if you see it any mistake / bug, you can open a issue).

**Max Object Limit(Recommended):** 10.000


---

Create Object and delete object (Server-side):

```javascript
 new ObjectService(objectName, vector3Pos, vector3Rot, onGroundProperly);


 ObjectService.delete(objectId)
```
---

Create Object with attached to entity (Server-side):

```javascript
 new ObjectService(objectName, vector3Pos, vector3Rot, onGroundProperly, {
     entity: player,
     xPos: 0.15,
     yPos: 0.0,
     zPos: -0.043,
     xRot: 15,
     yRot: 80,
     zRot: 150,
     useSoftPinning: false,
     collision: false,
     isPed: false,
     boneIndex: 57005,
     vertexIndex: 1,
     fixedRot: true
 });
```
