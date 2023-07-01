import { updateVanityUV } from "/main.js";

const picker = document.getElementById("picker");
const textureImage = document.getElementById("material");

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

const initPicker = () => {
    const texturePosInfo = getPositionInfo(textureImage);
    picker.style.top = `${texturePosInfo.y}px`;
    picker.style.left = `${texturePosInfo.x}px`;
    picker.hidden = false;
};

window.onload = () => {
    initPicker();
    updateVanityUV(calculateUVFromPicker());
};

window.onresize = () => {
    initPicker();
};

let mouseStartPosition = {};
let pickerStartLeft;
let pickerStartTop;
let dragging = false;

picker.onpointerdown = (e) => {
    mouseStartPosition.x = e.clientX;
    mouseStartPosition.y = e.clientY;
    const pickerStyle = getComputedStyle(picker);
    pickerStartLeft = Number(pickerStyle.left.slice(0, -2));
    pickerStartTop = Number(pickerStyle.top.slice(0, -2));
    dragging = true;
};

picker.onpointerup = (e) => {
    dragging = false;
};

window.onpointerup = (e) => {
    dragging = false;
};

window.onpointermove = (e) => {
    if (dragging) {
        // TODO: Make sure the picker is in the boundaries of the image or don't move it
        picker.style.left = `${pickerStartLeft + (e.clientX - mouseStartPosition.x)}px`;
        picker.style.top = `${pickerStartTop + (e.clientY - mouseStartPosition.y)}px`;
        updateVanityUV(calculateUVFromPicker());
    }
};
