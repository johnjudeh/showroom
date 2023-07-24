import { updateVanityUV, main } from "/main.js";

const picker = document.getElementById("picker");
const materialImage = document.getElementById("material");

const getPositionInfo = (element) => {
    const rect = element.getBoundingClientRect();
    return rect;
};

const inverse = (n) => 1 - n;

export const calculateUVFromPicker = () => {
    const pickerPosInfo = getPositionInfo(picker);
    const texturePosInfo = getPositionInfo(materialImage);

    const relativeWidth = pickerPosInfo.width / materialImage.width;
    const relativeHeight = pickerPosInfo.height / materialImage.height;

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
    const materialPosInfo = getPositionInfo(materialImage);
    picker.style.width = `${materialImage.width / 1.8}px`;
    picker.style.height = `${materialImage.height / 1.8}px`;
    picker.style.top = `${materialPosInfo.y}px`;
    picker.style.left = `${materialPosInfo.x}px`;
    picker.hidden = false;
};

window.onload = () => {
    main();
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
        // Set picker position, taking into account boundaries of material image
        const proposedLeft = pickerStartLeft + (e.clientX - mouseStartPosition.x);
        const proposedTop = pickerStartTop + (e.clientY - mouseStartPosition.y);
        const materialImagePosInfo = getPositionInfo(materialImage);
        const pickerPosInfo = getPositionInfo(picker);

        if (proposedLeft >= materialImagePosInfo.left && proposedLeft + pickerPosInfo.width <= materialImagePosInfo.right) {
            picker.style.left = `${pickerStartLeft + (e.clientX - mouseStartPosition.x)}px`;
        } else {
            if (proposedLeft < materialImagePosInfo.left) {
                picker.style.left = `${materialImagePosInfo.left}px`;
            } else {
                picker.style.left = `${materialImagePosInfo.right - pickerPosInfo.width}px`;
            }
        }

        if (proposedTop >= materialImagePosInfo.top && proposedTop + pickerPosInfo.height <= materialImagePosInfo.bottom) {
            picker.style.top = `${pickerStartTop + (e.clientY - mouseStartPosition.y)}px`;
        } else {
            if (proposedTop < materialImagePosInfo.top) {
                picker.style.top = `${materialImagePosInfo.top}px`;
            } else {
                picker.style.top = `${materialImagePosInfo.bottom - pickerPosInfo.height}px`;
            }
        }
        updateVanityUV(calculateUVFromPicker());
    }
};
