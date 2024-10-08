export class ProgressBlock {
    constructor(
        target,
        title = "Progress",
        initialState = { value: 20, animated: false, hidden: false }
    ) {
        this.state = { ...initialState };
        this.root = target;

        this.elements = this.setupElements(title);
        this.setProgress(this.state.value);
        this.setupHandlers();
    }

    setupElements(title) {
        const createDiv = (cls, txt = '') => {
            const div = document.createElement('div');
            cls.split(' ').forEach(c => div.classList.add(c));
            div.textContent = txt;
            return div;
        };

        const wrapper = createDiv("progress");
        const titleElem = createDiv("progress__title", title);
        const circle = this.createCircle();
        const controlPanel = this.buildControlPanel();

        if (this.state.hidden) circle.classList.add("progress__circle_hidden");
        if (this.state.animated) circle.classList.add("progress__circle_animated");

        wrapper.appendChild(titleElem);
        wrapper.appendChild(circle);
        wrapper.appendChild(controlPanel.panel);

        this.root.appendChild(wrapper);

        return { circle, controlPanel };
    }

    createCircle() {
        const circleWrapper = document.createElement('div');
        circleWrapper.classList.add('progress__circle');

        const circleInside = document.createElement('div');
        circleInside.classList.add('progress__circle-inside')
        circleWrapper.appendChild(circleInside)

        return circleWrapper;
    }

    buildControlPanel() {
        const panel = document.createElement("div");
        panel.classList.add("controls");

        const createValueControl = (text, type, val, id) => {
            const container = document.createElement("div");
            const input = document.createElement("input");
            const label = document.createElement("label");

            container.classList.add("controls__container");
            input.classList.add("controls__input");
            input.classList.add("controls__input_number")

            input.type = type;
            input.id = id;

            label.textContent = text;
            label.htmlFor = id;

            if (type === "checkbox") input.checked = val;
            if (type === "number") input.value = val;

            container.appendChild(input);
            container.appendChild(label);

            return { container, input };
        };

        const createCheckboxControl = (text, type, val, id) => {
            const container = document.createElement("div");
            const input = document.createElement("input");
            const label = document.createElement("label");
            const textContainer = document.createElement("p");

            container.classList.add("controls__container");
            input.classList.add("controls__input");
            input.classList.add("controls__input_checkbox")
            label.classList.add("controls__label")
            textContainer.classList.add("controls__text")

            input.type = type;
            input.id = id;
            input.checked = val;

            label.htmlFor = id;

            textContainer.textContent = text;

            container.appendChild(input);
            container.appendChild(label);
            container.appendChild(textContainer);

            return { container, input };
        }

        const valueControl = createValueControl("Value", "number", this.state.value, "progress-value");
        const animateControl = createCheckboxControl("Animate", "checkbox", this.state.animated, "animate-toggle");
        const hideControl = createCheckboxControl("Hide", "checkbox", this.state.hidden, "hide-toggle");

        [valueControl, animateControl, hideControl].forEach(c => panel.appendChild(c.container));

        return {
            panel,
            inputs: {
                value: valueControl.input,
                animate: animateControl.input,
                hide: hideControl.input
            }
        };
    }

    setupHandlers() {
        const { value, animate, hide } = this.elements.controlPanel.inputs;

        value.addEventListener("input", (e) => {
            let value = parseInt(e.target.value);

            if (isNaN(value) || value < 0) {
                e.target.value = 0;
            } else if (value > 100) {
                e.target.value = 100;
            }

            this.setProgress(e.target.value);
        });

        animate.addEventListener("change", () => {
            this.state.animated ? this.stopAnimation() : this.startAnimation();
        });

        hide.addEventListener("change", () => {
            this.state.hidden ? this.show() : this.hide();
        });
    }

    setProgress(newValue) {
        this.state.value = newValue;
        this.elements.circle.style.setProperty('--progress', String(newValue))
    }

    startAnimation() {
        this.elements.circle.classList.add("progress__circle_animated");
        this.state.animated = true;
    }

    stopAnimation() {
        this.elements.circle.classList.remove("progress__circle_animated");
        this.state.animated = false;
    }

    hide() {
        this.elements.circle.classList.add("progress__circle_hidden");
        this.state.hidden = true;
    }

    show() {
        this.elements.circle.classList.remove("progress__circle_hidden");
        this.state.hidden = false;
    }
}
