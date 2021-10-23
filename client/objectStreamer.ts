import alt from 'alt-client';
import native from 'natives';

export class ObjectStreamer implements IObject {
    public static objectList: Array<ObjectStreamer> = [];
    public static streamDistance: number = 100;

    public id: number;
    public model: string;
    public position: alt.Vector3;
    public rotation: alt.Vector3;
    public onGroundProperly: boolean;
    public attachData: IAttachedObjectData;

    public gameObject: number;

    constructor(objectData: IObject) {
        this.id = objectData.id;
        this.model = objectData.model;
        this.position = objectData.position;
        this.rotation = objectData.rotation;
        this.onGroundProperly = objectData.onGroundProperly;
        this.attachData = objectData.attachData;
        this.gameObject = null;

        ObjectStreamer.objectList.push(this);
    }

    static sync(objectList: Array<any>) {
        ObjectStreamer.objectList = objectList;
    }

    static create(objectData: IObject) {
        new ObjectStreamer(objectData);
    }

    static delete(id: number) {
        const objectIndex = ObjectStreamer.getIndexById(id);

        if (objectIndex < 0) {
            return;
        }

        const gameObject = ObjectStreamer.objectList[objectIndex].gameObject;

        ObjectStreamer.objectList.splice(objectIndex, 1);
        native.deleteObject(gameObject);
    }

    static getById(id: number) {
        return ObjectStreamer.objectList.find((object) => object.id === id);
    }

    static getIndexById(id: number) {
        return ObjectStreamer.objectList.findIndex((object) => object.id === id);
    }

    static updateObjectHandle(id: number, gameObject: number) {
        const object = ObjectStreamer.getById(id);

        if (!object) {
            return;
        }

        object.gameObject = gameObject;
    }

    static editAttachData(id: number, attachData: IAttachedObjectData) {
        const object = ObjectStreamer.getById(id);

        if (!object) {
            return;
        }

        object.attachData = attachData;

        if (object.gameObject) {
            ObjectStreamer.attachToEntity(object.gameObject, attachData);
        }
    }

    static attachToEntity(gameObject: number, attachData: IAttachedObjectData) {
        if (!gameObject) {
            return;
        }

        native.attachEntityToEntity(gameObject, attachData.entity, native.getPedBoneIndex(native.getPlayerPed(-1), attachData.boneIndex), attachData.xPos, attachData.yPos, attachData.zPos, attachData.xRot, attachData.yRot, attachData.zRot, false, attachData.useSoftPinning, attachData.collision, attachData.isPed, attachData.vertexIndex, attachData.fixedRot);
    }

    static show(object: ObjectStreamer) {
        const createdObject = native.createObject(native.getHashKey(object.model), object.position.x, object.position.y, object.position.z, false, false, false);

        native.setEntityRotation(createdObject, object.rotation.x, object.rotation.y, object.rotation.z, 0, false);
        native.freezeEntityPosition(createdObject, true);

        if (object.onGroundProperly) {
            native.placeObjectOnGroundProperly(createdObject);
        }

        if (object.attachData) {
            ObjectStreamer.attachToEntity(createdObject, object.attachData);
        }

        object.gameObject = createdObject;
        ObjectStreamer.updateObjectHandle(object.id, createdObject);
    }

    static hide(object: ObjectStreamer) {
        native.deleteObject(object.gameObject);

        object.gameObject = null;
        ObjectStreamer.updateObjectHandle(object.id, null);
    }

    static checkObjects() {
        if (alt.Player.local && alt.Player.local.pos) {
            ObjectStreamer.objectList.forEach((object) => {
                const objectPos = new alt.Vector3(object.position.x, object.position.y, object.position.z);

                if (object && !object.gameObject && distance(objectPos, alt.Player.local.pos) < ObjectStreamer.streamDistance) {
                    ObjectStreamer.show(object);
                }

                if (object.gameObject && distance(objectPos, alt.Player.local.pos) > ObjectStreamer.streamDistance && native.doesEntityExist(object.gameObject)) {
                    ObjectStreamer.hide(object);
                }
            });
        }
    }
}

alt.onServer(ObjectEvent.Create, ObjectStreamer.create);
alt.onServer(ObjectEvent.Delete, ObjectStreamer.delete);
alt.onServer(ObjectEvent.EditAttachData, ObjectStreamer.editAttachData);
alt.onServer(ObjectEvent.Sync, ObjectStreamer.sync);

alt.everyTick(ObjectStreamer.checkObjects);

function distance(vec1: alt.Vector3, vec2: alt.Vector3) {
    return Math.sqrt(Math.pow((vec1.x - vec2.x), 2) + Math.pow((vec1.y - vec2.y), 2) + Math.pow((vec1.z - vec2.z), 2));
}
