import {ProgressBlock} from './scripts/ProgressBlock.js'

const rootElement = document.querySelector("#root");

const progressBlock = new ProgressBlock(rootElement, "Progress", {
    value: 20,
    animated: false,
    hidden: false
});
