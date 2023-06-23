import { updateVanityUV } from "/main.js";

const picker = document.getElementById("picker");
const textureImage = document.getElementById("texture");

const getPositionInfo = (element) => {
    const rect = element.getBoundingClientRect();
    return rect;
};

const inverse = (n) => 1 - n;

export const calculateUVFromPicker = () => {
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

let mouseStartPosition = {};
let pickerStartLeft;
let pickerStartTop;
let dragging = false;

window.onload = () => updateVanityUV(calculateUVFromPicker());

picker.onmousedown = (e) => {
    mouseStartPosition.x = e.clientX;
    mouseStartPosition.y = e.clientY;
    const pickerStyle = getComputedStyle(picker);
    pickerStartLeft = Number(pickerStyle.left.slice(0, -2));
    pickerStartTop = Number(pickerStyle.top.slice(0, -2));
    dragging = true;
};

picker.onmouseup = (e) => {
    dragging = false;
};

window.onmousemove = (e) => {
    if (dragging) {
        // TODO: Make sure the picker is in the boundaries of the image or don't move it
        picker.style.left = `${pickerStartLeft + (e.clientX - mouseStartPosition.x)}px`;
        picker.style.top = `${pickerStartTop + (e.clientY - mouseStartPosition.y)}px`;
        updateVanityUV(calculateUVFromPicker());
    }
};
