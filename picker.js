const picker = document.getElementById("picker");
const textureImage = document.getElementById("texture");

const getPositionInfo = (element) => {
    const rect = element.getBoundingClientRect();
    console.log(rect);
    return rect;
};

const inverse = (n) => 1 - n;

export const calculateUV = () => {
    const pickerPosInfo = getPositionInfo(picker);
    const texturePosInfo = getPositionInfo(textureImage);

    const relativeWidth = pickerPosInfo.width / textureImage.width;
    const relativeHeight = pickerPosInfo.height / textureImage.height;

    const relativeX = (pickerPosInfo.x - texturePosInfo.x) / texturePosInfo.width;
    const relativeY = (pickerPosInfo.y - texturePosInfo.y) / texturePosInfo.height;

    const UV = {
        topLeft: { x: relativeX, y: inverse(relativeY) },
        topRight: { x: relativeX + relativeWidth, y: inverse(relativeY) },
        bottomRight: { x: relativeX + relativeWidth, y: inverse(relativeY + relativeHeight) },
        bottomLeft: { x: relativeX, y: inverse(relativeY + relativeHeight) },
    };

    return UV;
};