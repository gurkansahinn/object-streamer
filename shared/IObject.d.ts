declare interface IObject {
    id: number;
    model: string;
    position: PositionData;
    rotation: RotationData;
    onGroundProperly: boolean;
    attachData: IAttachedObjectData
}