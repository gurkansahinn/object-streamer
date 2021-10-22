declare interface IAttachedObjectData {
    entity: any | number;
    boneIndex: number;
    xPos: number;
    yPos: number;
    zPos: number;
    xRot: number;
    yRot: number;
    zRot: number;
    useSoftPinning: boolean;
    collision: boolean;
    isPed: boolean;
    vertexIndex: number;
    fixedRot: boolean;
}