import alt from 'alt-server';

export class ObjectService implements IObject {
    public static _id: number = 0;
    public static objectList: Array<ObjectService> = [];

    public id: number;
    public model: string;
    public position: alt.Vector3;
    public rotation: alt.Vector3;
    public onGroundProperly: boolean;
    public attachData: IAttachedObjectData;

    constructor(_model: string, _position: alt.Vector3, _rotation: alt.Vector3, _onGroundProperly: boolean, _attachData: IAttachedObjectData = null) {
        ObjectService._id++;

        this.id = ObjectService._id;
        this.model = _model;
        this.position = _position;
        this.rotation = _rotation;
        this.onGroundProperly = _onGroundProperly;
        this.attachData = _attachData;

        this.create();
    }

    create() {
        ObjectService.objectList.push(this);

        alt.emitAllClients(ObjectEvent.Create, this);
    }

    static onPlayerDisconnect(player: alt.Player) {
        ObjectService.deletePlayerAttachedObjects(player);
    }

    static editAttachObject(id: number, attachData: IAttachedObjectData) {
        const object = ObjectService.getById(id);

        if (!object) {
            return;
        }

        object.attachData = attachData;

        alt.emitAllClients(ObjectEvent.EditAttachData, id, attachData);
    }

    static sync(player: alt.Player) {
        if (ObjectService.objectList.length) {
            alt.emitClient(player, ObjectEvent.Sync, ObjectService.objectList);
        }
    }

    static delete(id: number) {
        const objectIndex = ObjectService.getIndexById(id);

        if (objectIndex < 0) {
            return;
        }

        ObjectService.objectList.splice(objectIndex, 1);

        alt.emitAllClients(ObjectEvent.Delete, id);
    }

    static getById(id: number) {
        return ObjectService.objectList.find((object) => object.id === id);
    }

    static getIndexById(id: number) {
        return ObjectService.objectList.findIndex((object) => object.id === id);
    }

    static getPlayerAttachedObjects(player: alt.Player) {
        let objects = [];

        ObjectService.objectList.find((object) => {
            if (object.attachData && object.attachData.entity) {
                objects.push(object);
            }
        })

        return objects;
    }

    static deletePlayerAttachedObjects(player: alt.Player) {
        const objects = ObjectService.getPlayerAttachedObjects(player);

        objects.forEach((object) => {
            ObjectService.delete(object.id);
        });
    }
}

alt.on("playerConnect", ObjectService.sync);
alt.on("playerDisconnect", ObjectService.onPlayerDisconnect);
